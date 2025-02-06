import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchFlow } from "@/lib/actions/flow";
import Link from "next/link";
import { FlowForm } from "./components/flow-form";

interface FlowPageProps {
  params: Promise<{ flowId: string }>;
}

export default async function FlowPage({ params }: FlowPageProps) {
  const { flowId } = await params;
  const flow = flowId === "new" ? undefined : (await fetchFlow(flowId)).data;

  const title = flowId === "new" ? "Yeni Flow Oluştur" : "Flow Güncelle";

  const description =
    flowId === "new"
      ? "Flowinizin detaylarını girerek yeni bir flow oluşturun"
      : "Flowinizin detaylarını güncelleyin";

  const defaultValues = {
    name: flow?.name || "",
    description: flow?.description || "",
  };

  return (
    <div className="flex-1 overflow-auto p-8 flex justify-center gap-8">
      <Card className="w-[600px] hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <FlowForm defaultValues={defaultValues} flowId={flowId} />
        </CardContent>
      </Card>
      {flowId !== "new" && (
        <Link href={`/flowish/flows/${flowId}/playground`}>
          <Card className="w-[600px] h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold text-center">
                Playground
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      )}
    </div>
  );
}
