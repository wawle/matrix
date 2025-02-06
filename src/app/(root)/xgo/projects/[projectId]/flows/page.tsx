import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Calendar, Clock, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { fetchFlows } from "@/lib/actions/flow";

export default async function FlowsPage() {
  const { data: flows } = await fetchFlows();

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Flows</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yeni Proje Kartı */}
          <Link href="/flowish/flows/new">
            <Card className="h-[240px] flex flex-col items-center justify-center hover:border-primary transition-all hover:shadow-md cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-medium text-foreground">
                  New Flow
                </h3>
              </CardContent>
            </Card>
          </Link>

          {/* Mevcut Projeler */}
          {flows.map((flow) => (
            <Link key={flow.id} href={`/flowish/flows/${flow.id}`}>
              <Card className="h-[240px] hover:border-primary transition-all hover:shadow-md cursor-pointer">
                <CardHeader className="space-y-2">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{flow.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {flow.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span>{flow.steps?.length || 0} Step</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {flow.createdAt
                          ? new Date(flow.createdAt).toLocaleDateString("tr-TR")
                          : "Tarih yok"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {flow.updatedAt
                          ? formatDistanceToNow(new Date(flow.updatedAt), {
                              addSuffix: true,
                              locale: tr,
                            })
                          : "Tarih yok"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
