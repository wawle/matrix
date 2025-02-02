import { NextRequest, NextResponse } from "next/server";
  import { 
    createAgent, 
    getAgents 
  } from "@/lib/services/agent";
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const agent = await createAgent(body);
  
      return NextResponse.json(agent, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const agents = await getAgents();
      return NextResponse.json(agents);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }