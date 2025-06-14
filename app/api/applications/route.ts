import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8080/api/applications"; // Java backend endpoint

export enum ApplicationStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WAITLISTED = "WAITLISTED",
  WITHDRAWN = "WITHDRAWN"
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  personalStatement?: string;
  feedback?: string;
  uploadedFilePath?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentGpa?: number;
  programId: number;
  programName: string;
  universityId: number;
  universityName: string;
  submissionDate: string;
  lastUpdated: string;
}

// GET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: "GET",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/${body.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
