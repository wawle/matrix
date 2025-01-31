
// actions
import { fetchChats, deleteChatAction } from "@/lib/actions/chat";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const ChatList = async() => {
  const { data } = await fetchChats();

  return (
    <Container
      title="Chat Listesi"
      description="Chat bilgilerini görüntüleyebilirsiniz."
      className=""
       actions={
        <Link href={"/admin/chats/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        onDelete={deleteChatAction}
        defaultColumnVisibility={{
  "sender": true,
  "message": true,
  "session": true
}}
      />
    </Container>
  );
};
  