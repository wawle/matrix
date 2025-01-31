
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { AgentSchema, AgentFormData } from "@/lib/schemas/agent";
import {
  createAgentAction,
  fetchAgent,
  updateAgentAction,
} from "@/lib/actions/agent";

interface Props {
  agentId: string;
}

export async function AgentEdit(props: Props) {
  const { agentId } = props;
  const { data } = await fetchAgent(agentId);
  
  const schema = Object.keys(AgentSchema.shape);
  const defaultValues = schema.reduce<Record<string, any>>((acc, key) => {
    acc[key] = (data as Record<string, any>)?.[key] || "";
    return acc;
  }, {});

  const inputs = schema
    .filter((key) => key !== "id" && key !== "_id" && key !== "createdAt" && key !== "updatedAt")
    .map((key) => ({
      name: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      type: "text",
    }));

  const title = data?.id ? "Agent Düzenle" : "Agent Oluştur";
  const description = data?.id
    ? "Agent bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Agent oluşturabilirsiniz.";

  const onSubmit = async (data: AgentFormData) => {
   "use server";

    // validate data
    const result = AgentSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Agent
      response = await updateAgentAction(data.id, data);
    } else {
      // create Agent
      response = await createAgentAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/agents");
  };

  return (
    <Container
      title={title}
      description={description}
      className=""
    >
      <FormUI defaultValues={defaultValues} inputs={inputs} onSubmit={onSubmit} />
    </Container>
  )
}
    