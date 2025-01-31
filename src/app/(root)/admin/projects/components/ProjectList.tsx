
// actions
import { fetchProjects, deleteProjectAction } from "@/lib/actions/project";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const ProjectList = async() => {
  const { data } = await fetchProjects();

  return (
    <Container
      title="Project Listesi"
      description="Project bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/projects/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteProjectAction}
        defaultColumnVisibility={{
  "name": true,
  "description": true,
  "user": true
}}
      />
    </Container>
  );
};
  