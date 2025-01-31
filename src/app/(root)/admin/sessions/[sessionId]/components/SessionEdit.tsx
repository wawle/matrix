
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { SessionSchema, SessionFormData } from "@/lib/schemas/session";
import {
  createSessionAction,
  fetchSession,
  updateSessionAction,
} from "@/lib/actions/session";

interface Props {
  sessionId: string;
}

export async function SessionEdit(props: Props) {
  const { sessionId } = props;
  const { data } = await fetchSession(sessionId);
  
  const schema = Object.keys(SessionSchema.shape);
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

  const title = data?.id ? "Session Düzenle" : "Session Oluştur";
  const description = data?.id
    ? "Session bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Session oluşturabilirsiniz.";

  const onSubmit = async (data: SessionFormData) => {
   "use server";

    // validate data
    const result = SessionSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Session
      response = await updateSessionAction(data.id, data);
    } else {
      // create Session
      response = await createSessionAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/sessions");
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
    