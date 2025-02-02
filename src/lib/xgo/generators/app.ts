import { exec } from "child_process";
import { writeFile } from "fs";
import path from "path";
import { generateCode } from "./code";
import util from "util";
import templates from "../constants/templates";
import { buildPostmanCollection } from "./postman";
import { IModel } from "@/lib/models/model";
import { IEdge } from "@/lib/models/edge";

const execPromise = util.promisify(exec);
const writeFilePromise = util.promisify(writeFile);

// Next.js projesi oluşturma fonksiyonu
export async function createNextProject(appData: {
  projectName: string;
  version: {
    name: string;
    models: IModel[];
    relations: IEdge[];
  };
}): Promise<{ success: boolean; error?: string }> {
  const { projectName, version } = appData;
  const projectPath = path.resolve(process.cwd(), projectName);

  console.log(`Creating Next.js project at: ${projectPath} 🚀`);

  const command = `npx create-next-app@latest ${projectName} --typescript --no-import-alias --yes`;

  try {
    // Adım 1: Next.js projesi oluştur
    const { stderr } = await execPromise(command);

    if (stderr) {
      return {
        success: false,
        error: `Error creating Next.js project: ${stderr} 🚨`,
      };
    }

    console.log(`Next.js project '${projectName}' created successfully! ✅`);

    const style = "new-york";
    const baseColor = "neutral";

    // Adım 2: components.json dosyasını oluştur
    const componentsConfig = {
      $schema: "https://ui.shadcn.com/schema.json",
      style: style,
      rsc: true,
      tsx: true,
      tailwind: {
        config: "tailwind.config.ts",
        css: "src/app/globals.css",
        baseColor: baseColor,
        cssVariables: true,
        prefix: "",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
      iconLibrary: "lucide",
    };

    const componentsPath = path.join(projectPath, "components.json");

    await writeFilePromise(
      componentsPath,
      JSON.stringify(componentsConfig, null, 2)
    );

    console.log("components.json dosyası oluşturuldu! ✅");
    console.log("Shadcn yapılandırması başlatılıyor... 🚀");

    // Adım 3: Shadcn bileşenlerini ve gerekli paketleri ekle
    await execPromise(
      `npx shadcn@latest add accordion alert alert-dialog avatar badge breadcrumb button calendar card checkbox command table dialog dropdown-menu form input label pagination popover radio-group scroll-area select separator sheet sidebar skeleton sonner switch tabs textarea toggle toggle-group tooltip && yarn add @tanstack/react-table react-hook-form zod tailwindcss-animate mongoose tailwind-merge jose bcryptjs @types/bcryptjs`,
      {
        cwd: path.join(projectPath),
      }
    );

    console.log("Shadcn bileşenleri başarıyla eklendi! ✅");

    // Adım 4: Tailwind config dosyası güncelleniyor
    console.log("Tailwind config dosyası güncelleniyor... 🚀");
    const tailwindConfig = templates.util.tailwind.template("", {});
    await writeFilePromise(
      path.join(projectPath, "tailwind.config.ts"),
      tailwindConfig
    );
    console.log("tailwind.config.ts dosyası güncellendi! ✅");

    // Adım 5: globals.css dosyası oluştur
    console.log("globals.css dosyası oluşturuluyor... 🚀");
    const globals = templates.util.globals.template("", {});
    await writeFilePromise(
      path.join(projectPath, "src/app/globals.css"),
      globals
    );
    console.log("globals.css dosyası oluşturuldu! ✅");

    // Adım 6: Eslint config dosyası oluştur
    console.log("Eslint config dosyası oluşturuluyor... 🚀");
    const eslintConfig = templates.util.eslint.template("", {});
    await writeFilePromise(
      path.join(projectPath, "eslint.config.mjs"),
      eslintConfig
    );
    console.log(".eslint.config.mjs dosyası oluşturuldu! ✅");

    // Adım 7: Env dosyası oluştur
    console.log("Env dosyası oluşturuluyor... 🚀");
    const env = templates.util.env.template(projectName, { projectName });
    await writeFilePromise(path.join(projectPath, ".env"), env);
    console.log(".env dosyası oluşturuldu! ✅");

    // Adım 8: Kod üretimi
    console.log("Kod üretimi başlatılıyor... 🚀");
    const codePath = path.join(projectPath, "src");
    const result = await generateCode(projectName, version, codePath);

    if (!result.success) {
      return {
        success: false,
        error: `Error generating code: ${result.error} 🚨`,
      };
    }

    console.log("Kod üretimi tamamlandı! ✅");

    // Adım 9: Postman collection oluştur
    console.log("Postman collection oluşturuluyor... 🚀");
    await buildPostmanCollection(projectPath, projectName, version);
    console.log("Postman collection oluşturuldu! ✅");

    console.log("🎉 Kurulum tamamlandı. 🎉");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Hata oluştu: ${error.message} 🚨`);
    } else {
      console.error("Beklenmeyen bir hata oluştu 🚨");
    }
    return { success: false, error: "Beklenmeyen bir hata oluştu 🚨" };
  }
}
