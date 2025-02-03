// actions
import { fetchUsers, deleteUserAction } from "@/lib/actions/user";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const UserList = async () => {
  const { data } = await fetchUsers();

  return (
    <Container
      title="User Listesi"
      description="User bilgilerini görüntüleyebilirsiniz."
      actions={
        <Link href={"/admin/users/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteUserAction}
        defaultColumnVisibility={{
          fullname: true,
          email: true,
          password: true,
          photo: true,
          role: true,
        }}
      />
    </Container>
  );
};
