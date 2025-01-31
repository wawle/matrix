
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { FlowStepSchema, FlowStepFormData } from "@/lib/schemas/flowstep";
import {
  createFlowStepAction,
  fetchFlowStep,
  updateFlowStepAction,
} from "@/lib/actions/flowstep";

interface Props {
  flowstepId: string;
}

export async function FlowStepEdit(props: Props) {
  const { flowstepId } = props;
  const { data } = await fetchFlowStep(flowstepId);
  
  const schema = Object.keys(FlowStepSchema.shape);
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

  const title = data?.id ? "FlowStep Düzenle" : "FlowStep Oluştur";
  const description = data?.id
    ? "FlowStep bilgilerini düzenleyebilirsiniz."
    : "Yeni bir FlowStep oluşturabilirsiniz.";

  const onSubmit = async (data: FlowStepFormData) => {
   "use server";

    // validate data
    const result = FlowStepSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update FlowStep
      response = await updateFlowStepAction(data.id, data);
    } else {
      // create FlowStep
      response = await createFlowStepAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/flowsteps");
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
    