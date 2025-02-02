export const routeId = {
  template: (modelName: string, props: any) => {
    const routeName = modelName.toLowerCase();

    return `import { NextResponse } from "next/server";
  import { 
    get${modelName}ById,
    update${modelName},
    delete${modelName}
  } from "@/lib/services/${routeName}";
  
  type RouteParams = Promise<{
    ${routeName}Id: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }): Promise<NextResponse> {
    try {
      const resolvedParams = await params;
      const ${routeName} = await get${modelName}ById(resolvedParams.${routeName}Id);
      return NextResponse.json(${routeName});
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(request: Request, { params }: { params: RouteParams }): Promise<NextResponse> {
    try {
      const resolvedParams = await params;
      const body = await request.json();
      const ${routeName} = await update${modelName}(resolvedParams.${routeName}Id, body);
      return NextResponse.json(${routeName});
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: RouteParams }): Promise<NextResponse> {
    try {
      const resolvedParams = await params;
      await delete${modelName}(resolvedParams.${routeName}Id);
      return NextResponse.json({ message: "${modelName} başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }`;
  },
};
