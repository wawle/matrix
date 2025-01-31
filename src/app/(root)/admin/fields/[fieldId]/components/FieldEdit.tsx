
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { FieldSchema, FieldFormData } from "@/lib/schemas/field";
import {
  createFieldAction,
  fetchField,
  updateFieldAction,
} from "@/lib/actions/field";

interface Props {
  fieldId: string;
}

export async function FieldEdit(props: Props) {
  const { fieldId } = props;
  const { data } = await fetchField(fieldId);
  
  const schema = Object.keys(FieldSchema.shape);
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

  const title = data?.id ? "Field Düzenle" : "Field Oluştur";
  const description = data?.id
    ? "Field bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Field oluşturabilirsiniz.";

  const onSubmit = async (data: FieldFormData) => {
   "use server";

    // validate data
    const result = FieldSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Field
      response = await updateFieldAction(data.id, data);
    } else {
      // create Field
      response = await createFieldAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/fields");
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
    