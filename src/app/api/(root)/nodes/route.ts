import { NextResponse } from "next/server";
  import { 
    createNode, 
    getNodes 
  } from "@/lib/services/node";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const node = await createNode(body);
  
      return NextResponse.json(node, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const nodes = await getNodes();
      return NextResponse.json(nodes);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }