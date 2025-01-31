import { NextResponse } from "next/server";
  import { 
    createEdge, 
    getEdges 
  } from "@/lib/services/edge";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const edge = await createEdge(body);
  
      return NextResponse.json(edge, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const edges = await getEdges();
      return NextResponse.json(edges);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }