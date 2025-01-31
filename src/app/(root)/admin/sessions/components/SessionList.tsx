
// actions
import { fetchSessions, deleteSessionAction } from "@/lib/actions/session";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const SessionList = async() => {
  const { data } = await fetchSessions();

  return (
    <Container
      title="Session Listesi"
      description="Session bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/sessions/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteSessionAction}
        defaultColumnVisibility={{
  "agent": true,
  "user": true
}}
      />
    </Container>
  );
};
  