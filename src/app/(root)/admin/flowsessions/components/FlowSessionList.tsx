
// actions
import { fetchFlowSessions, deleteFlowSessionAction } from "@/lib/actions/flowsession";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const FlowSessionList = async() => {
  const { data } = await fetchFlowSessions();

  return (
    <Container
      title="FlowSession Listesi"
      description="FlowSession bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/flowsessions/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteFlowSessionAction}
        defaultColumnVisibility={{
  "flow": true,
  "session": true
}}
      />
    </Container>
  );
};
  