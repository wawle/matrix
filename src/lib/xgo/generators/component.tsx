import { dirname, join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { ComponentNode, PageNode } from "@/lib/types/xgo";
import templates from "../constants/templates";

// Recursive olarak child component'leri oluşturan yardımcı fonksiyon
async function generateChildComponents(
  child: any,
  currentPath: string = ""
): Promise<{ imports: string; usage: string }> {
  let imports = "";
  let usage = "";

  if (child.template) {
    // Child component'in kendi import'u
    imports += `import { ${child.name} } from '${currentPath}${child.name}';\n`;

    // Child'ın children'ları varsa recursive olarak işle
    if (child.props?.children?.length) {
      let childrenResult = { imports: "", usage: "" };

      for (const grandChild of child.props.children) {
        const result = await generateChildComponents(
          grandChild,
          `${currentPath}${child.name}/components/`
        );
        childrenResult.imports += result.imports;
        childrenResult.usage += result.usage;
      }

      imports += childrenResult.imports;
      usage += `<${child.name}/>\n`;
    } else {
      usage += `<${child.name} />\n`;
    }
  }

  return { imports, usage };
}

// Component içeriğini oluşturan ana fonksiyon
export async function generateComponentContent(
  filePath: string,
  comp: ComponentNode
): Promise<string> {
  const [templateName, templateType] = comp.template.split(".");
  const templateDef = (templates.components as any)[templateName][templateType];

  let childImports = "";
  let childUsage = "";

  // Props içindeki children'ları işle
  if (Array.isArray(comp.props?.children)) {
    for (const child of comp.props.children) {
      await generateComponentFile(filePath, child);
      const result = await generateChildComponents(child, "./");
      childImports += result.imports;
      childUsage += result.usage;
    }
  }

  // Template fonksiyonunu çağır
  const updatedProps =
    childUsage || comp.props?.children
      ? {
          ...comp.props,
          children: childUsage || comp.props?.children,
        }
      : comp.props;

  return childImports + templateDef?.template(comp.name, updatedProps || {});
}

export async function generateComponentFile(
  filePath: string,
  comp: ComponentNode
) {
  // Önce child component'i oluştur
  const componentContent = await generateComponentContent(filePath, comp);

  const componentPath = join(dirname(filePath), "components");
  await mkdir(componentPath, { recursive: true });
  const componentFilePath = join(componentPath, `${comp.name}.tsx`);

  await writeFile(componentFilePath, componentContent);
}

export async function generateComponent(
  filePath: string,
  props: { children: PageNode[] }
) {
  let componentImports = "";
  let componentUsage = "";
  const components = props.children;
  for (const comp of components) {
    if (comp.template) {
      await generateComponentFile(filePath, comp as ComponentNode);

      // Import ve kullanım kodlarını ekle
      componentImports += `import { ${comp.name} } from './components/${comp.name}';\n`;
      if (Array.isArray(comp.props?.children)) {
        componentUsage += `<${comp.name} />\n`;
      } else if (comp.props?.children) {
        componentUsage += `<${comp.name}>\n${comp.props?.children}\n</${comp.name}>\n`;
      } else if (comp.props?.dynamics) {
        const props = Object.entries(comp.props?.dynamics).map(
          ([key, value]) => `${key}={${value}}`
        );
        componentUsage += `<${comp.name} ${props.join(" ")} />\n`;
      } else {
        componentUsage += `<${comp.name} />\n`;
      }
    }
  }

  return { imports: componentImports, usage: componentUsage };
}
