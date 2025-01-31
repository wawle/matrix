import { NextResponse } from "next/server";
  import { 
    createUser, 
    getUsers 
  } from "@/lib/services/user";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const user = await createUser(body);
  
      return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const users = await getUsers();
      return NextResponse.json(users);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }