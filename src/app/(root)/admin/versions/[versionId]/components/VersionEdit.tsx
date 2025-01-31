
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { VersionSchema, VersionFormData } from "@/lib/schemas/version";
import {
  createVersionAction,
  fetchVersion,
  updateVersionAction,
} from "@/lib/actions/version";

interface Props {
  versionId: string;
}

export async function VersionEdit(props: Props) {
  const { versionId } = props;
  const { data } = await fetchVersion(versionId);
  
  const schema = Object.keys(VersionSchema.shape);
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

  const title = data?.id ? "Version Düzenle" : "Version Oluştur";
  const description = data?.id
    ? "Version bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Version oluşturabilirsiniz.";

  const onSubmit = async (data: VersionFormData) => {
   "use server";

    // validate data
    const result = VersionSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Version
      response = await updateVersionAction(data.id, data);
    } else {
      // create Version
      response = await createVersionAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/versions");
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
    