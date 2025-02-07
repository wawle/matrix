export const list = {
  template: (name: string, props: Record<string, any>): string => {
    const className = props.className || "";
    const modelName = props.modelName;
    const routeName = modelName.toLowerCase();

    const title = props.title || `${modelName} Listesi`;
    const description =
      props.description || `${modelName} bilgilerini görüntüleyebilirsiniz.`;

    const defaultColumnVisibility = props.defaultColumnVisibility || {};

    return `
// actions
import { fetch${modelName}s, delete${modelName}Action } from "@/lib/actions/${routeName}";
// components
import { Container } from "@/components/ui/container";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";



export const ${name} = async() => {
  const { data } = await fetch${modelName}s();

  return (
    <Container
      title="${title}"
      description="${description}"
      className="${className}"
       actions={
        <Link href={"/admin/${routeName}s/new"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data.data}
        onDelete={delete${modelName}Action}
        defaultColumnVisibility={${JSON.stringify(
          defaultColumnVisibility,
          null,
          2
        )}}
      />
    </Container>
  );
};
  `;
  },
};
