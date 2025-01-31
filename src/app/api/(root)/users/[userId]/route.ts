import { NextResponse } from "next/server";
  import { 
    getUserById,
    updateUser,
    deleteUser
  } from "@/lib/services/user";
  
  type RouteParams = Promise<{
    userId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const user = await getUserById(resolvedParams.userId);
      return NextResponse.json(user);
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
      const user = await updateUser(resolvedParams.userId, body);
      return NextResponse.json(user);
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
      await deleteUser(resolvedParams.userId);
      return NextResponse.json({ message: "User başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }