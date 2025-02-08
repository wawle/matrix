// actions
import { fetchAgents, deleteAgentAction } from "@/lib/actions/agent";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const AgentList = async () => {
  const { data } = await fetchAgents();

  return (
    <Container
      title="Agent Listesi"
      description="Agent bilgilerini görüntüleyebilirsiniz."
      className=""
      actions={
        <Link href={"/admin/agents/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data.data}
        onDelete={deleteAgentAction}
        defaultColumnVisibility={{
          instructions: true,
          stream: true,
          model_provider: true,
          model_name: true,
          max_tokens: true,
          temperature: true,
          seed: true,
          name: true,
          title: true,
          is_public: true,
          photo: true,
          key: true,
        }}
      />
    </Container>
  );
};
