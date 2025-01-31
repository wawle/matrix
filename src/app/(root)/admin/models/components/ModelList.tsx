
// actions
import { fetchModels, deleteModelAction } from "@/lib/actions/model";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const ModelList = async() => {
  const { data } = await fetchModels();

  return (
    <Container
      title="Model Listesi"
      description="Model bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/models/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteModelAction}
        defaultColumnVisibility={{
  "name": true,
  "version": true,
  "description": true
}}
      />
    </Container>
  );
};
  