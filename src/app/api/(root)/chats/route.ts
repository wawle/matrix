import { NextResponse } from "next/server";
  import { 
    createChat, 
    getChats 
  } from "@/lib/services/chat";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const chat = await createChat(body);
  
      return NextResponse.json(chat, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const chats = await getChats();
      return NextResponse.json(chats);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }