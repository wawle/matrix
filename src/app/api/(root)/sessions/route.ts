import { NextResponse } from "next/server";
  import { 
    createSession, 
    getSessions 
  } from "@/lib/services/session";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const session = await createSession(body);
  
      return NextResponse.json(session, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const sessions = await getSessions();
      return NextResponse.json(sessions);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }