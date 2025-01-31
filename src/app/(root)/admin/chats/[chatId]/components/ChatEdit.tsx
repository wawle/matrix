
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { ChatSchema, ChatFormData } from "@/lib/schemas/chat";
import {
  createChatAction,
  fetchChat,
  updateChatAction,
} from "@/lib/actions/chat";

interface Props {
  chatId: string;
}

export async function ChatEdit(props: Props) {
  const { chatId } = props;
  const { data } = await fetchChat(chatId);
  
  const schema = Object.keys(ChatSchema.shape);
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

  const title = data?.id ? "Chat Düzenle" : "Chat Oluştur";
  const description = data?.id
    ? "Chat bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Chat oluşturabilirsiniz.";

  const onSubmit = async (data: ChatFormData) => {
   "use server";

    // validate data
    const result = ChatSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Chat
      response = await updateChatAction(data.id, data);
    } else {
      // create Chat
      response = await createChatAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/chats");
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
    