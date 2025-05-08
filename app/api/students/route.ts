import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://localhost:8080/api/students";

interface Student {
  id: number;
  name: string;
  email?: string;
  university: string;
  program: string;
  status: string;
}

// GET all students
export async function GET() {
  try {
    const response = await fetch(BASE_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    const students: Student[] = await response.json();
    return NextResponse.json(students);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - create a student
export async function POST(request: Request) {
  try {
    const student: Student = await request.json();

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error(`Failed to create student: ${response.statusText}`);
    }

    const createdStudent = await response.json();
    return NextResponse.json(createdStudent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
