
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { FlowSessionSchema, FlowSessionFormData } from "@/lib/schemas/flowsession";
import {
  createFlowSessionAction,
  fetchFlowSession,
  updateFlowSessionAction,
} from "@/lib/actions/flowsession";

interface Props {
  flowsessionId: string;
}

export async function FlowSessionEdit(props: Props) {
  const { flowsessionId } = props;
  const { data } = await fetchFlowSession(flowsessionId);
  
  const schema = Object.keys(FlowSessionSchema.shape);
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

  const title = data?.id ? "FlowSession Düzenle" : "FlowSession Oluştur";
  const description = data?.id
    ? "FlowSession bilgilerini düzenleyebilirsiniz."
    : "Yeni bir FlowSession oluşturabilirsiniz.";

  const onSubmit = async (data: FlowSessionFormData) => {
   "use server";

    // validate data
    const result = FlowSessionSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update FlowSession
      response = await updateFlowSessionAction(data.id, data);
    } else {
      // create FlowSession
      response = await createFlowSessionAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/flowsessions");
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
    