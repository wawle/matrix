import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default async function XgoPage() {
  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Xgo</h1>
        <p className="text-muted-foreground mt-2">
          Create & Manage your projects
        </p>
      </div>

      {/* Yeni Modül Ekleme Kartı */}
      <Link href="/xgo/projects/new">
        <Card className="h-[180px] flex flex-col items-center justify-center hover:border-primary transition-all hover:shadow-md cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center">
            <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
            <h3 className="text-xl font-medium text-foreground mt-4">
              Create New Project
            </h3>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
