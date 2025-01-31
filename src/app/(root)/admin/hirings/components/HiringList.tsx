
// actions
import { fetchHirings, deleteHiringAction } from "@/lib/actions/hiring";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const HiringList = async() => {
  const { data } = await fetchHirings();

  return (
    <Container
      title="Hiring Listesi"
      description="Hiring bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/hirings/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteHiringAction}
        defaultColumnVisibility={{
  "user": true,
  "agent": true
}}
      />
    </Container>
  );
};
  