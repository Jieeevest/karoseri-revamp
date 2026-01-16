import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const satuanList = await db.satuanBarang.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        barang: true
      }
    })

    return NextResponse.json({
      success: true,
      data: satuanList
    })
  } catch (error) {
    console.error('Error fetching satuan barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch satuan barang' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama } = body

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama satuan wajib diisi' },
        { status: 400 }
      )
    }

    const existingSatuan = await db.satuanBarang.findFirst({
      where: {
        nama: {
          equals: nama.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (existingSatuan) {
      return NextResponse.json(
        { success: false, error: 'Nama satuan sudah ada' },
        { status: 400 }
      )
    }

    const newSatuan = await db.satuanBarang.create({
      data: {
        nama: nama.trim()
      }
    })

    return NextResponse.json({
      success: true,
      data: newSatuan,
      message: 'Satuan barang berhasil ditambahkan'
    })
  } catch (error) {
    console.error('Error creating satuan barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create satuan barang' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nama } = body

    if (!id || !nama || nama.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'ID dan nama satuan wajib diisi' },
        { status: 400 }
      )
    }

    const existingSatuan = await db.satuanBarang.findFirst({
      where: {
        AND: [
          { id: id },
          {
            nama: {
              equals: nama.trim(),
              mode: 'insensitive'
            }
          }
        ]
      }
    })

    if (existingSatuan) {
      return NextResponse.json(
        { success: false, error: 'Nama satuan sudah digunakan' },
        { status: 400 }
      )
    }

    const updatedSatuan = await db.satuanBarang.update({
      where: { id },
      data: {
        nama: nama.trim()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedSatuan,
      message: 'Satuan barang berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating satuan barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update satuan barang' },
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
        { success: false, error: 'ID satuan wajib diisi' },
        { status: 400 }
      )
    }

    // Check if satuan is being used by any barang
    const satuanInUse = await db.barang.findFirst({
      where: {
        satuanId: id
      }
    })

    if (satuanInUse) {
      return NextResponse.json(
        { success: false, error: 'Satuan tidak dapat dihapus karena masih digunakan oleh barang' },
        { status: 400 }
      )
    }

    await db.satuanBarang.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Satuan barang berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting satuan barang:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete satuan barang' },
      { status: 500 }
    )
  }
}