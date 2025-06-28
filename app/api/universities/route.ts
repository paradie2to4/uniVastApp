import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8081/api/universities";

// GET Method
export async function GET() {
    try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch universities');
        }

        const universities = await response.json();
        return NextResponse.json(universities);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST Method
export async function POST(request: Request) {
    try {
        const university = await request.json();

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(university),
        });

        if (!response.ok) {
            throw new Error('Failed to create university');
        }

        const newUniversity = await response.json();
        return NextResponse.json(newUniversity);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
