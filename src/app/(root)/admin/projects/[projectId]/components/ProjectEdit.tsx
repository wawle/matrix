
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { ProjectSchema, ProjectFormData } from "@/lib/schemas/project";
import {
  createProjectAction,
  fetchProject,
  updateProjectAction,
} from "@/lib/actions/project";

interface Props {
  projectId: string;
}

export async function ProjectEdit(props: Props) {
  const { projectId } = props;
  const { data } = await fetchProject(projectId);
  
  const schema = Object.keys(ProjectSchema.shape);
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

  const title = data?.id ? "Project Düzenle" : "Project Oluştur";
  const description = data?.id
    ? "Project bilgilerini düzenleyebilirsiniz."
    : "Yeni bir Project oluşturabilirsiniz.";

  const onSubmit = async (data: ProjectFormData) => {
   "use server";

    // validate data
    const result = ProjectSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update Project
      response = await updateProjectAction(data.id, data);
    } else {
      // create Project
      response = await createProjectAction(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/projects");
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
    