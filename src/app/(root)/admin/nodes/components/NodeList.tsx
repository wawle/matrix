
// actions
import { fetchNodes, deleteNodeAction } from "@/lib/actions/node";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const NodeList = async() => {
  const { data } = await fetchNodes();

  return (
    <Container
      title="Node Listesi"
      description="Node bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/nodes/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteNodeAction}
        defaultColumnVisibility={{
  "version": true,
  "data": true
}}
      />
    </Container>
  );
};
  