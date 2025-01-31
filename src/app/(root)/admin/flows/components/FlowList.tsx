
// actions
import { fetchFlows, deleteFlowAction } from "@/lib/actions/flow";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const FlowList = async() => {
  const { data } = await fetchFlows();

  return (
    <Container
      title="Flow Listesi"
      description="Flow bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/flows/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteFlowAction}
        defaultColumnVisibility={{
  "name": true,
  "description": true,
  "user": true
}}
      />
    </Container>
  );
};
  