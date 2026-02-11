import { NextResponse } from "next/server";
import { generateNextCode } from "@/lib/code-generator";

export async function GET() {
  try {
    const nextCode = await generateNextCode("CUS", "customer");
    return NextResponse.json({ code: nextCode });
  } catch (error) {
    console.error("Failed to generate customer code:", error);
    return NextResponse.json(
      { error: "Failed to generate customer code" },
      { status: 500 },
    );
  }
}
