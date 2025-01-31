import { NextResponse } from "next/server";
  import { 
    createVersion, 
    getVersions 
  } from "@/lib/services/version";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const version = await createVersion(body);
  
      return NextResponse.json(version, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const versions = await getVersions();
      return NextResponse.json(versions);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }