// actions
import { fetchEdges, deleteEdgeAction } from "@/lib/actions/edge";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const EdgeList = async () => {
  const { data } = await fetchEdges();

  return (
    <Container
      title="Edge Listesi"
      description="Edge bilgilerini görüntüleyebilirsiniz."
      className=""
      actions={
        <Link href={"/admin/edges/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteEdgeAction}
        defaultColumnVisibility={{
          targetName: true,
          sourceName: true,
          label: true,
        }}
      />
    </Container>
  );
};
