
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { NodeSchema, NodeFormData } from "@/lib/schemas/node";
import {
  createNodeAction,
  fetchNode,
  updateNodeAction,
} from "@/lib/actions/node";

interface Props {
  nodeId: string;
}

export async function NodeEdit(props: Props) {
  const { nodeId } = props;
  const { data } = await fetchNode(nodeId);
  
  const schema = Object.keys(NodeSchema.shape);
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

  const title = data?.id ? "Node Düzenle" : "Node Oluştur";
  const description = data?.id
    ? "Node bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Node oluşturabilirsiniz.";

  const onSubmit = async (data: NodeFormData) => {
   "use server";

    // validate data
    const result = NodeSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Node
      response = await updateNodeAction(data.id, data);
    } else {
      // create Node
      response = await createNodeAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/nodes");
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
    