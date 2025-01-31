
// actions
import { fetchVersions, deleteVersionAction } from "@/lib/actions/version";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const VersionList = async() => {
  const { data } = await fetchVersions();

  return (
    <Container
      title="Version Listesi"
      description="Version bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/versions/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteVersionAction}
        defaultColumnVisibility={{
  "name": true,
  "description": true,
  "project": true,
  "is_active": true
}}
      />
    </Container>
  );
};
  