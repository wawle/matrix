export const edit = {
  template: (name: string, props: Record<string, any>): string => {
    const className = props.className || "";
    const modelName = props.modelName;
    const routeName = modelName.toLowerCase();
    const title = props.title || `${modelName} Düzenle`;
    const description =
      props.description || `${modelName} bilgilerini düzenleyebilirsiniz.`;
    return `
import { Container } from "@/components/ui/container";
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { ${modelName}Schema, ${modelName}FormData } from "@/lib/schemas/${routeName}";
import {
  create${modelName}Action,
  fetch${modelName},
  update${modelName}Action,
} from "@/lib/actions/${routeName}";

interface Props {
  ${routeName}Id: string;
}

export async function ${name}(props: Props) {
  const { ${routeName}Id } = props;
  const { data } = await fetch${modelName}(${routeName}Id);
  
  const schema = Object.keys(${modelName}Schema.shape);
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

  const title = data?.id ? "${title}" : "${modelName} Oluştur";
  const description = data?.id
    ? "${description}"
    : "Yeni bir ${modelName} oluşturabilirsiniz.";

  const onSubmit = async (data: ${modelName}FormData) => {
   "use server";

    // validate data
    const result = ${modelName}Schema.safeParse(data);
    if (!result.success) {
      return { error: result.error.message };
    }

    let response;
    if (data.id) {
      // update ${modelName}
      response = await update${modelName}Action(data.id, data);
    } else {
      // create ${modelName}
      response = await create${modelName}Action(data);
    }

    if (response.error) {
      return { error: response.error };
    }

    redirect("/admin/${routeName}s");
  };

  return (
    <Container
      title={title}
      description={description}
      className="${className}"
    >
      <FormUI defaultValues={defaultValues} inputs={inputs} onSubmit={onSubmit} />
    </Container>
  )
}
    `;
  },
};
