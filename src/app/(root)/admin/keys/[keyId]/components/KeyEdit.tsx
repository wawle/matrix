
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { KeySchema, KeyFormData } from "@/lib/schemas/key";
import {
  createKeyAction,
  fetchKey,
  updateKeyAction,
} from "@/lib/actions/key";

interface Props {
  keyId: string;
}

export async function KeyEdit(props: Props) {
  const { keyId } = props;
  const { data } = await fetchKey(keyId);
  
  const schema = Object.keys(KeySchema.shape);
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

  const title = data?.id ? "Key Düzenle" : "Key Oluştur";
  const description = data?.id
    ? "Key bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Key oluşturabilirsiniz.";

  const onSubmit = async (data: KeyFormData) => {
   "use server";

    // validate data
    const result = KeySchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Key
      response = await updateKeyAction(data.id, data);
    } else {
      // create Key
      response = await createKeyAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/keys");
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
    