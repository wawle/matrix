import { NextResponse } from "next/server";
  import { 
    createProject, 
    getProjects 
  } from "@/lib/services/project";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const project = await createProject(body);
  
      return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const projects = await getProjects();
      return NextResponse.json(projects);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }