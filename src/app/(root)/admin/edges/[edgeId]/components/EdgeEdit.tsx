
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { EdgeSchema, EdgeFormData } from "@/lib/schemas/edge";
import {
  createEdgeAction,
  fetchEdge,
  updateEdgeAction,
} from "@/lib/actions/edge";

interface Props {
  edgeId: string;
}

export async function EdgeEdit(props: Props) {
  const { edgeId } = props;
  const { data } = await fetchEdge(edgeId);
  
  const schema = Object.keys(EdgeSchema.shape);
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

  const title = data?.id ? "Edge Düzenle" : "Edge Oluştur";
  const description = data?.id
    ? "Edge bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Edge oluşturabilirsiniz.";

  const onSubmit = async (data: EdgeFormData) => {
   "use server";

    // validate data
    const result = EdgeSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Edge
      response = await updateEdgeAction(data.id, data);
    } else {
      // create Edge
      response = await createEdgeAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/edges");
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
    