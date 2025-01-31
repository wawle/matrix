
// actions
import { fetchKeys, deleteKeyAction } from "@/lib/actions/key";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const KeyList = async() => {
  const { data } = await fetchKeys();

  return (
    <Container
      title="Key Listesi"
      description="Key bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/keys/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteKeyAction}
        defaultColumnVisibility={{
  "name": true,
  "description": true,
  "value": true,
  "type": true,
  "user": true
}}
      />
    </Container>
  );
};
  