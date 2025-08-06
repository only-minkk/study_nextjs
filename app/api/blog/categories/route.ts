import { NextResponse } from "next/server";
import { getAllCategories } from "@/app/lib/blog-loader";

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error loading blog categories:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
