
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { HiringSchema, HiringFormData } from "@/lib/schemas/hiring";
import {
  createHiringAction,
  fetchHiring,
  updateHiringAction,
} from "@/lib/actions/hiring";

interface Props {
  hiringId: string;
}

export async function HiringEdit(props: Props) {
  const { hiringId } = props;
  const { data } = await fetchHiring(hiringId);
  
  const schema = Object.keys(HiringSchema.shape);
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

  const title = data?.id ? "Hiring Düzenle" : "Hiring Oluştur";
  const description = data?.id
    ? "Hiring bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Hiring oluşturabilirsiniz.";

  const onSubmit = async (data: HiringFormData) => {
   "use server";

    // validate data
    const result = HiringSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Hiring
      response = await updateHiringAction(data.id, data);
    } else {
      // create Hiring
      response = await createHiringAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/hirings");
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
    