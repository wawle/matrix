
// actions
import { fetchFlowSteps, deleteFlowStepAction } from "@/lib/actions/flowstep";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const FlowStepList = async() => {
  const { data } = await fetchFlowSteps();

  return (
    <Container
      title="FlowStep Listesi"
      description="FlowStep bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/flowsteps/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteFlowStepAction}
        defaultColumnVisibility={{
  "flow": true,
  "agent": true,
  "order": true
}}
      />
    </Container>
  );
};
  