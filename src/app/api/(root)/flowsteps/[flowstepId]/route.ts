import { NextResponse } from "next/server";
  import { 
    getFlowStepById,
    updateFlowStep,
    deleteFlowStep
  } from "@/lib/services/flowstep";
  
  type RouteParams = Promise<{
    flowstepId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const flowstep = await getFlowStepById(resolvedParams.flowstepId);
      return NextResponse.json(flowstep);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const body = await request.json();
      const flowstep = await updateFlowStep(resolvedParams.flowstepId, body);
      return NextResponse.json(flowstep);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      await deleteFlowStep(resolvedParams.flowstepId);
      return NextResponse.json({ message: "FlowStep başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }