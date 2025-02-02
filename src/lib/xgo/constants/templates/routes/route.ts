export const route = {
  template: (modelName: string, props: any) => {
    const routeName = modelName.toLowerCase();

    return `import { NextResponse } from "next/server";
  import { 
    create${modelName}, 
    get${modelName}s 
  } from "@/lib/services/${routeName}";
  
  export async function POST(request: Request): Promise<NextResponse> {
    try {
      const body = await request.json();
      const ${routeName} = await create${modelName}(body);
  
      return NextResponse.json(${routeName}, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET(): Promise<NextResponse> {
    try {
      const ${routeName}s = await get${modelName}s();
      return NextResponse.json(${routeName}s);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }`;
  },
};
