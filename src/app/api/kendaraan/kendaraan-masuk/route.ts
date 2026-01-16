import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { nomor: { contains: search, mode: 'insensitive' } },
        { customer: { nama: { contains: search, mode: 'insensitive' } },
        { kendaraan: { nomorPolisi: { contains: search, mode: 'insensitive' } } }
      ]
    } : {}

    const [kendaraanMasukList, totalCount] = await Promise.all([
      db.kendaraanMasuk.findMany({
        where,
        include: {
          customer: true,
          kendaraan: true,
          pengerjaan: true,
          kelengkapan: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.kendaraanMasuk.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: kendaraanMasukList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching kendaraan masuk:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch kendaraan masuk' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tanggalMasuk, 
      showroom, 
      customerId, 
      nomorPolisi, 
      merek, 
      tipe, 
      pengerjaan,
      kelengkapan 
    } = body

    // Validation
    if (!tanggalMasuk || !showroom || !customerId || !nomorPolisi || !merek || !tipe) {
      return NextResponse.json(
        { success: false, error: 'Field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Generate nomor
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    
    const latestKM = await db.kendaraanMasuk.findFirst({
      orderBy: { createdAt: 'desc' },
      where: {
        nomor: {
          startsWith: `KM-${year}-${month}`
        }
      }
    })

    let sequence = 1
    if (latestKM) {
      const latestNumber = parseInt(latestKM.nomor.split('-')[2])
      sequence = latestNumber + 1
    }

    const nomor = `KM-${year}-${month}-${String(sequence).padStart(3, '0')}`

    // Create or get customer
    const customerRecord = await db.customer.findUnique({
      where: { id: customerId }
    })

    if (!customerRecord) {
      return NextResponse.json(
        { success: false, error: 'Customer tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create vehicle record
    const kendaraanRecord = await db.kendaraan.create({
      data: {
        nomorPolisi,
        nomorChasis: '', // Will be filled later
        nomorMesin: '', // Will be filled later
        merekId: '', // Will be created if not exists
        tipeId: '', // Will be created if not exists
        customerId,
        status: 'MASUK'
      }
    })

    const newKendaraanMasuk = await db.kendaraanMasuk.create({
      data: {
        nomor,
        tanggalMasuk: new Date(tanggalMasuk),
        showroom: showroom.trim(),
        customerId,
        kendaraanId: kendaraanRecord.id
      },
      include: {
        customer: true,
        kendaraan: true
      }
    })

      // Create pengerjaan records
    if (pengerjaan && pengerjaan.length > 0) {
      const pengerjaanData = pengerjaan.map((p: any) => ({
        kendaraanMasukId: newKendaraanMasuk.id,
        jenis: p.jenis,
        deskripsi: p.deskripsi || null
      }))

      await db.pengerjaan.createMany({
        data: pengerjaanData
      })
    }

    // Create kelengkapan records
    if (kelengkapan && kelengkapan.length > 0) {
      const kelengkapanData = kelengkapan.map((k: any) => ({
        kendaraanMasukId: newKendaraanMasuk.id,
        area: k.area,
        nama: k.nama,
        jumlah: k.jumlah || null,
        kondisi: k.kondisi,
        deskripsi: k.deskripsi || null
      }))

      await db.kelengkapanAlat.createMany({
        data: kelengkapanData
      })
    }

    // Return complete record with all relations
    const completeRecord = await db.kendaraanMasuk.findUnique({
      where: { id: newKendaraanMasuk.id },
      include: {
        customer: true,
        kendaraan: true,
        pengerjaan: true,
        kelengkapan: true
      }
    })

    return NextResponse.json({
      success: true,
      data: completeRecord,
      message: 'Kendaraan masuk berhasil dicatat'
    })
  } catch (error) {
    console.error('Error creating kendaraan masuk:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create kendaraan masuk' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID kendaraan masuk wajib diisi' },
        { status: 400 }
      )
    }

    // Check if kendaraan masuk is referenced in other tables
    const kendaraanMasukInUse = await db.kendaraanKeluar.findFirst({
      where: { kendaraanMasukId: id }
    })

    if (kendaraanMasukInUse) {
      return NextResponse.json(
        { success: false, error: 'Data kendaraan masuk tidak dapat dihapus karena sudah ada proses keluar' },
        { status: 400 }
      )
    }

    await db.kendaraanMasuk.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Data kendaraan masuk berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting kendaraan masuk:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete kendaraan masuk' },
      { status: 500 }
    )
  }
}