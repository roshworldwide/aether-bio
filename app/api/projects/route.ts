import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all projects from the Database
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }, // Newest first
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("DB FETCH ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST: Create a new project in the Database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        tagline: "AUTONOMOUS GENERATIVE ENTITY",
        category: "SYSTEM",
        status: "ACTIVE"
      }
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("DB WRITE ERROR:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}