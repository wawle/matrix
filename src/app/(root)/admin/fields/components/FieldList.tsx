
// actions
import { fetchFields, deleteFieldAction } from "@/lib/actions/field";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const FieldList = async() => {
  const { data } = await fetchFields();

  return (
    <Container
      title="Field Listesi"
      description="Field bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/fields/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteFieldAction}
        defaultColumnVisibility={{
  "name": true,
  "label": true,
  "type": true,
  "validations": true
}}
      />
    </Container>
  );
};
  