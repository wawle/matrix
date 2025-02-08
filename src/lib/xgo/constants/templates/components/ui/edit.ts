import { ISchema } from "@/lib/types/xgo/models";

export const edit = {
  template: (name: string, props: Record<string, any>): string => {
    const className = props.className || "";
    const modelName = props.modelName;
    const routeName = modelName.toLowerCase();
    const fields = props.fields as ISchema[];
    const title = props.title || `${modelName} Düzenle`;
    const description =
      props.description || `${modelName} bilgilerini düzenleyebilirsiniz.`;

    const fetchlist = fields.filter((field) => field.type === "reference");
    const actions = fetchlist.map((field) => {
      const fieldName = `${
        field.name.charAt(0).toUpperCase() + field.name.slice(1)
      }`;

      return `fetch${fieldName}s()`;
    });
    const dataList = fetchlist.map((field) => {
      return `{ data: ${field.name}s }`;
    });
    const fetchStr = `const [${dataList.join(
      ","
    )}] = await Promise.all([${actions.join(",")}])`;

    const fetchStrImports = fetchlist.map((field) => {
      const fieldName = `${
        field.name.charAt(0).toUpperCase() + field.name.slice(1)
      }`;
      return `import { fetch${fieldName}s } from "@/lib/actions/${field.name.toLowerCase()}";`;
    });

    const inputs = fields.map((field) => {
      return `{ name: "${field.name}", label: "${field.label}", type: "${
        field.type
      }",
      placeholder: "${field.name} giriniz",
      options: ${
        field.type === "reference"
          ? `${field.name}s.data.map((item) => ({ label: item.${
              field?.optionLabel || "name"
            }, value: item.id }))`
          : "[]"
      } }`;
    });

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
${fetchStrImports.join("\n")}


interface Props {
  ${routeName}Id: string;
}

export async function ${name}(props: Props) {
  const { ${routeName}Id } = props;
  const { data } = await fetch${modelName}(${routeName}Id);
  ${fetchStr}
  const isEdit = !!data?.id;

  
  const defaultValues = {
    ${fields
      .map((field) => {
        switch (field.type) {
          case "date":
            return `${field.name}: data?.${field.name} || new Date()`;
          case "number":
            return `${field.name}: data?.${field.name} || 0`;
          default:
            return `${field.name}: data?.${field.name} || ""`;
        }
      })
      .join(",\n")}
  };

  const inputs = [${inputs}]
 

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
    if (isEdit) {
      // update ${modelName}
      response = await update${modelName}Action(${routeName}Id, data);
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
