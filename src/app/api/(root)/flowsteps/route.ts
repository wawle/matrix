import { NextResponse } from "next/server";
  import { 
    createFlowStep, 
    getFlowSteps 
  } from "@/lib/services/flowstep";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const flowstep = await createFlowStep(body);
  
      return NextResponse.json(flowstep, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const flowsteps = await getFlowSteps();
      return NextResponse.json(flowsteps);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }