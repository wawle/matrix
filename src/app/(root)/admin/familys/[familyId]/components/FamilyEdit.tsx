
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { FamilySchema, FamilyFormData } from "@/lib/schemas/family";
import {
  createFamilyAction,
  fetchFamily,
  updateFamilyAction,
} from "@/lib/actions/family";

interface Props {
  familyId: string;
}

export async function FamilyEdit(props: Props) {
  const { familyId } = props;
  const { data } = await fetchFamily(familyId);
  
  const schema = Object.keys(FamilySchema.shape);
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

  const title = data?.id ? "Family Düzenle" : "Family Oluştur";
  const description = data?.id
    ? "Family bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Family oluşturabilirsiniz.";

  const onSubmit = async (data: FamilyFormData) => {
   "use server";

    // validate data
    const result = FamilySchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Family
      response = await updateFamilyAction(data.id, data);
    } else {
      // create Family
      response = await createFamilyAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/familys");
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
    