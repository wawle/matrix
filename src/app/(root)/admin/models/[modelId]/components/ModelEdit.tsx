
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { ModelSchema, ModelFormData } from "@/lib/schemas/model";
import {
  createModelAction,
  fetchModel,
  updateModelAction,
} from "@/lib/actions/model";

interface Props {
  modelId: string;
}

export async function ModelEdit(props: Props) {
  const { modelId } = props;
  const { data } = await fetchModel(modelId);
  
  const schema = Object.keys(ModelSchema.shape);
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

  const title = data?.id ? "Model Düzenle" : "Model Oluştur";
  const description = data?.id
    ? "Model bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Model oluşturabilirsiniz.";

  const onSubmit = async (data: ModelFormData) => {
   "use server";

    // validate data
    const result = ModelSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Model
      response = await updateModelAction(data.id, data);
    } else {
      // create Model
      response = await createModelAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/models");
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
    