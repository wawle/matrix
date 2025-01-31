
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { FlowSchema, FlowFormData } from "@/lib/schemas/flow";
import {
  createFlowAction,
  fetchFlow,
  updateFlowAction,
} from "@/lib/actions/flow";

interface Props {
  flowId: string;
}

export async function FlowEdit(props: Props) {
  const { flowId } = props;
  const { data } = await fetchFlow(flowId);
  
  const schema = Object.keys(FlowSchema.shape);
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

  const title = data?.id ? "Flow Düzenle" : "Flow Oluştur";
  const description = data?.id
    ? "Flow bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Flow oluşturabilirsiniz.";

  const onSubmit = async (data: FlowFormData) => {
   "use server";

    // validate data
    const result = FlowSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Flow
      response = await updateFlowAction(data.id, data);
    } else {
      // create Flow
      response = await createFlowAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/flows");
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
    