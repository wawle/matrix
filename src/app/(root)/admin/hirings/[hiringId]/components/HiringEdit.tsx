import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { HiringSchema, HiringFormData } from "@/lib/schemas/hiring";
import {
  createHiringAction,
  fetchHiring,
  updateHiringAction,
} from "@/lib/actions/hiring";
import { fetchUsers } from "@/lib/actions/user";
import { fetchAgents } from "@/lib/actions/agent";

interface Props {
  hiringId: string;
}

export async function HiringEdit(props: Props) {
  const { hiringId } = props;
  const [{ data: hiring }, { data: users }, { data: agents }] =
    await Promise.all([fetchHiring(hiringId), fetchUsers(), fetchAgents()]);

  const schema = Object.keys(HiringSchema.shape);
  const defaultValues = schema.reduce<Record<string, any>>((acc, key) => {
    acc[key] = (hiring as Record<string, any>)?.[key] || "";
    return acc;
  }, {});

  const inputs = [
    {
      name: "user",
      label: "User",
      type: "reference",
      reference: "User",
      placeholder: "User Seçiniz",
      options: users?.map((user) => ({
        label: user.fullname,
        value: user.id,
      })),
    },
    {
      name: "agent",
      label: "Agent",
      type: "reference",
      reference: "Agent",
      placeholder: "Agent Seçiniz",
      options: agents?.map((agent) => ({
        label: agent.name,
        value: agent.id,
      })),
    },
  ];

  const title = hiring?.id ? "Hiring Düzenle" : "Hiring Oluştur";
  const description = hiring?.id
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
    <Container title={title} description={description} className="">
      <FormUI
        defaultValues={defaultValues}
        inputs={inputs}
        onSubmit={onSubmit}
      />
    </Container>
  );
}
