import { NextResponse } from "next/server";

export interface Program {
  id: number;
  name: string;
  university: {
    id: number;
    name: string;
    location?: string;
  };
  degree: string;
  duration: string;
  description: string;
  tuitionFee: number;
  applicationCount?: number;
}

// Fetch programs from your Java backend
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const universityId = url.searchParams.get("universityId");
    const degree = url.searchParams.get("degree");
    const search = url.searchParams.get("search");

    let endpoint = "http://localhost:8080/api/programs";
    if (universityId) {
      endpoint = `http://localhost:8080/api/universities/${universityId}/programs`;
    }

    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch programs");

    let programs: Program[] = await response.json();

    // Apply filtering client-side for degree & search
    if (degree) {
      programs = programs.filter(
          (program) => program.degree.toLowerCase() === degree.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      programs = programs.filter(
          (program) =>
              program.name.toLowerCase().includes(searchLower) ||
              program.description.toLowerCase().includes(searchLower) ||
              program.university.name.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(programs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new program via Java backend
export async function POST(request: Request) {
  try {
    const program = await request.json();

    if (!program.name || !program.university?.id || !program.degree || !program.duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await fetch(
        `http://localhost:8080/api/universities/${program.university.id}/programs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(program),
        }
    );

    if (!response.ok) {
      throw new Error(`Failed to create program: ${await response.text()}`);
    }

    const newProgram = await response.json();
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error: any) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
