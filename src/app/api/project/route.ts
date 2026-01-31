import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "tanggal";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nomor: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
        { customer: { nama: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [projects, totalCount] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, deskripsi, quantity, hargaPerUnit } = body;

    if (!customerId || !deskripsi) {
      return NextResponse.json(
        { success: false, error: "Customer and description are required" },
        { status: 400 },
      );
    }

    // Generate Number (SPK-YYYY-XXX)
    const year = new Date().getFullYear();
    const count = await db.project.count();
    const nomor = `SPK-${year}-${String(count + 1).padStart(3, "0")}`;

    const newProject = await db.project.create({
      data: {
        nomor,
        customerId,
        deskripsi,
        quantity: parseInt(quantity) || 1,
        hargaPerUnit: parseFloat(hargaPerUnit) || 0,
        totalHarga: (parseInt(quantity) || 1) * (parseFloat(hargaPerUnit) || 0),
        status: "OFFER",
        tanggal: new Date(),
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, customerId, deskripsi, quantity, hargaPerUnit, status } = body;

    if (!id || !customerId) {
      return NextResponse.json(
        { success: false, error: "ID and Customer are required" },
        { status: 400 },
      );
    }

    const updatedProject = await db.project.update({
      where: { id },
      data: {
        customerId,
        deskripsi,
        quantity: parseInt(quantity) || 1,
        hargaPerUnit: parseFloat(hargaPerUnit) || 0,
        totalHarga: (parseInt(quantity) || 1) * (parseFloat(hargaPerUnit) || 0),
        status: status || "OFFER",
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    // Integrity Check
    const relations = await Promise.all([
      db.kendaraan.findFirst({ where: { projectId: id } }),
    ]);

    if (relations.some((r) => r !== null)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Project cannot be deleted because it is referenced by Kendaraan",
        },
        { status: 400 },
      );
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
