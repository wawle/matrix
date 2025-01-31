
// actions
import { fetchFamilys, deleteFamilyAction } from "@/lib/actions/family";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const FamilyList = async() => {
  const { data } = await fetchFamilys();

  return (
    <Container
      title="Family Listesi"
      description="Family bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/familys/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteFamilyAction}
        defaultColumnVisibility={{
  "agent": true,
  "parent": true
}}
      />
    </Container>
  );
};
  