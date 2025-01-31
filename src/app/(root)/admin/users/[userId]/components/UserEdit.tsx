
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { UserSchema, UserFormData } from "@/lib/schemas/user";
import {
  createUserAction,
  fetchUser,
  updateUserAction,
} from "@/lib/actions/user";

interface Props {
  userId: string;
}

export async function UserEdit(props: Props) {
  const { userId } = props;
  const { data } = await fetchUser(userId);
  
  const schema = Object.keys(UserSchema.shape);
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

  const title = data?.id ? "User Düzenle" : "User Oluştur";
  const description = data?.id
    ? "User bilgilerini düzenleyebilirsiniz."
    : "Yeni bir User oluşturabilirsiniz.";

  const onSubmit = async (data: UserFormData) => {
   "use server";

    // validate data
    const result = UserSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update User
      response = await updateUserAction(data.id, data);
    } else {
      // create User
      response = await createUserAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/users");
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
    