import { NextResponse } from "next/server";
  import { 
    createFlow, 
    getFlows 
  } from "@/lib/services/flow";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const flow = await createFlow(body);
  
      return NextResponse.json(flow, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const flows = await getFlows();
      return NextResponse.json(flows);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }