// generators/page-generator.ts
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { generateComponent } from "./component";
import { access, constants } from "fs/promises";
import templates from "../constants/templates";
import { PageNode } from "@/lib/types/xgo";

// Dizinin var olup olmadığını kontrol eden yardımcı fonksiyon
export async function directoryExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Dosyanın var olup olmadığını kontrol eden yardımcı fonksiyon
export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function generatePageStructure(
  nodes: PageNode[],
  basePath: string,
  currentPath: string = ""
): Promise<void> {
  for (const node of nodes) {
    const { name, template, children, props } = node;
    const nodePath = join(currentPath, name);
    const fullPath = join(basePath, nodePath);
    // Eğer children varsa, klasör oluştur
    if (children) {
      const exists = await directoryExists(fullPath);
      if (!exists) {
        await mkdir(fullPath, { recursive: true });
      }
      // Alt dizinleri işle
      await generatePageStructure(children, basePath, nodePath);
    }

    // Template varsa, ilgili dosyayı oluştur
    if (template) {
      let filePath = children
        ? join(fullPath, `${template}.tsx`) // Klasör içinde dosya
        : `${fullPath}.tsx`; // Direkt dosya

      let fileContent = "";
      let componentImports = "";
      let componentUsage = "";

      // Props içinde children varsa, component'leri oluştur
      if (props?.children?.length) {
        const result = await generateComponent(filePath, {
          children: props.children,
        });
        componentImports = result.imports;
        componentUsage = result.usage;
      }

      // Template tipine göre içeriği oluştur
      switch (template) {
        case "page":
          fileContent = templates.page.default.template(name, {
            children: componentUsage,
          });
          break;
        case "layout":
          fileContent = templates.page.layout.template(name, {
            children: componentUsage,
          });
          break;
        case "loading":
          fileContent = templates.page.loading.template(name, {});
          break;
        case "error":
          fileContent = templates.page.error.template(name, {});
          break;
        case "not-found":
          fileContent = templates.page.notFound.template(name, {});
          break;
      }

      fileContent = componentImports + fileContent;

      if (!(await fileExists(filePath))) {
        await writeFile(filePath, fileContent);
      }
    }
  }
}
