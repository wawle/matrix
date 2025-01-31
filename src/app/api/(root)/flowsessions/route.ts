import { NextResponse } from "next/server";
  import { 
    createFlowSession, 
    getFlowSessions 
  } from "@/lib/services/flowsession";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const flowsession = await createFlowSession(body);
  
      return NextResponse.json(flowsession, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const flowsessions = await getFlowSessions();
      return NextResponse.json(flowsessions);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }