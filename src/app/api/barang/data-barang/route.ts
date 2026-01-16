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
        { nama: { contains: search, mode: 'insensitive' } },
        { kode: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    const [barangList, totalCount] = await Promise.all([
      db.barang.findMany({
        where,
        include: {
          kategoriBarang: true,
          satuanBarang: true,
          hargaBarang: {
            include: {
              supplier: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.barang.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: barangList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barang' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kode, nama, kategoriId, satuanId, stok, stokMinimum } = body

    // Validation
    if (!kode || !nama || !kategoriId || !satuanId) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Check if kode already exists
    const existingKode = await db.barang.findFirst({
      where: { kode: { equals: kode, mode: 'insensitive' } }
    })

    if (existingKode) {
      return NextResponse.json(
        { success: false, error: 'Kode barang sudah ada' },
        { status: 400 }
      )
    }

    const newBarang = await db.barang.create({
      data: {
        kode: kode.trim(),
        nama: nama.trim(),
        kategoriId: parseInt(kategoriId),
        satuanId,
        stok: parseInt(stok) || 0,
        stokMinimum: parseInt(stokMinimum) || 0
      },
      include: {
        kategoriBarang: true,
        satuanBarang: true
      }
    })

    return NextResponse.json({
      success: true,
      data: newBarang,
      message: 'Barang berhasil ditambahkan'
    })
  } catch (error) {
    console.error('Error creating barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create barang' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, kode, nama, kategoriId, satuanId, stok, stokMinimum } = body

    if (!id || !kode || !nama || !kategoriId || !satuanId) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Check if kode already exists (excluding current record)
    const existingKode = await db.barang.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { kode: { equals: kode, mode: 'insensitive' } }
        ]
      }
    })

    if (existingKode) {
      return NextResponse.json(
        { success: false, error: 'Kode barang sudah digunakan' },
        { status: 400 }
      )
    }

    const updatedBarang = await db.barang.update({
      where: { id },
      data: {
        kode: kode.trim(),
        nama: nama.trim(),
        kategoriId: parseInt(kategoriId),
        satuanId,
        stok: parseInt(stok) || 0,
        stokMinimum: parseInt(stokMinimum) || 0
      },
      include: {
        kategoriBarang: true,
        satuanBarang: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedBarang,
      message: 'Barang berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update barang' },
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
        { success: false, error: 'ID barang wajib diisi' },
        { status: 400 }
      )
    }

    // Check if barang is referenced in other tables
    const barangInUse = await Promise.all([
      db.hargaBarang.findFirst({ where: { barangId: id } }),
      db.barangMasuk.findFirst({ where: { barangId: id } }),
      db.barangKeluar.findFirst({ where: { barangId: id } }),
      db.purchaseOrderItem.findFirst({ where: { barangId: id } })
    ])

    const isInUse = barangInUse.some(ref => ref !== null)

    if (isInUse) {
      return NextResponse.json(
        { success: false, error: 'Barang tidak dapat dihapus karena masih digunakan dalam transaksi' },
        { status: 400 }
      )
    }

    await db.barang.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Barang berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete barang' },
      { status: 500 }
    )
  }
}