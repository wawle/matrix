import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { generatePageStructure } from "./page";
import templates from "../constants/templates";
import { unlink } from "fs";
import { templateBuilder } from "../constants/projects";
import { PageNode } from "@/lib/types/xgo";
import { IModel } from "@/lib/models/model";
import { IEdge } from "@/lib/models/edge";

export interface GeneratedCode {
  path: string;
  content: string;
}

export async function generateCode(
  projectName: string,
  version: {
    name: string;
    models: IModel[];
    relations: IEdge[];
  },
  outputPath: string
) {
  try {
    const adminDashboardPages: PageNode[] = templateBuilder.initiate("crm", {
      projectName,
      version: version.name,
      models: version.models,
    });

    // Ana dizinleri oluştur
    const directories = [
      "app/api/(root)",
      "app/api/(auth)/login",
      "app/api/(auth)/register",
      "app/api/(auth)/logout",
      "app/api/(auth)/me",
      "lib/models",
      "lib/services",
      "lib/actions",
      "lib/types",
      "lib/schemas",
      "components/sidebar",
      "components/theme",
    ];

    // Önce tüm ana dizinleri oluştur
    await Promise.all(
      directories.map((dir) =>
        mkdir(join(outputPath, dir), { recursive: true })
      )
    );

    await generatePageStructure(adminDashboardPages, `${outputPath}/app/`);

    // Her model için dosyaları oluştur
    for (const model of version.models) {
      const routeName = model.name.toLowerCase();

      // Model-specific dizinleri oluştur
      await Promise.all([
        mkdir(join(outputPath, "app/api/(root)", `${routeName}s`), {
          recursive: true,
        }),
        mkdir(
          join(
            outputPath,
            "app/api/(root)",
            `${routeName}s`,
            `[${routeName}Id]`
          ),
          {
            recursive: true,
          }
        ),
      ]);

      // Dosyaları oluştur
      await Promise.all([
        // Models
        writeFile(
          join(outputPath, "lib/models", `${routeName}.ts`),
          templates.model.default.template(model.name, {
            model,
            relations: version.relations,
          })
        ),
        // API
        writeFile(
          join(outputPath, "app/api/(root)", `${routeName}s`, "route.ts"),
          templates.route.default.template(model.name, {})
        ),
        // API ID
        writeFile(
          join(
            outputPath,
            "app/api/(root)",
            `${routeName}s`,
            `[${routeName}Id]`,
            "route.ts"
          ),
          templates.route.id.template(model.name, {})
        ),
        // Services
        writeFile(
          join(outputPath, "lib/services", `${routeName}.ts`),
          templates.service.default.template(model.name, {})
        ),
        // Actions
        writeFile(
          join(outputPath, "lib/actions", `${routeName}.ts`),
          templates.action.default.template(model.name, {})
        ),
        // Schemas
        writeFile(
          join(outputPath, "lib/schemas", `${routeName}.ts`),
          templates.schema.default.template(model.name, { model })
        ),
      ]);
    }

    await Promise.all([
      // Auth
      // Services
      writeFile(
        join(outputPath, "lib/services/auth.ts"),
        templates.service.auth.template("", {})
      ),
      // Actions
      writeFile(
        join(outputPath, "lib/actions/auth.ts"),
        templates.action.auth.template("", {})
      ),
      // Schemas
      writeFile(
        join(outputPath, "lib/schemas/auth.ts"),
        templates.schema.auth.template("", {})
      ),
      // API Routes
      writeFile(
        join(outputPath, "app/api/(auth)", "login", "route.ts"),
        templates.route.auth.login.template("", {})
      ),
      writeFile(
        join(outputPath, "app/api/(auth)", "register", "route.ts"),
        templates.route.auth.register.template("", {})
      ),
      writeFile(
        join(outputPath, "app/api/(auth)", "logout", "route.ts"),
        templates.route.auth.logout.template("", {})
      ),
      writeFile(
        join(outputPath, "app/api/(auth)", "me", "route.ts"),
        templates.route.auth.me.template("", {})
      ),

      // Components
      // Sidebar
      writeFile(
        join(outputPath, "components/sidebar/nav-actions.tsx"),
        templates.components.sidebar.nav.actions.template("", {})
      ),
      writeFile(
        join(outputPath, "components/sidebar/nav-models.tsx"),
        templates.components.sidebar.nav.models.template("", {})
      ),
      writeFile(
        join(outputPath, "components/sidebar/nav-main.tsx"),
        templates.components.sidebar.nav.main.template("", {})
      ),
      writeFile(
        join(outputPath, "components/sidebar/nav-secondary.tsx"),
        templates.components.sidebar.nav.secondary.template("", {})
      ),
      writeFile(
        join(outputPath, "components/sidebar/nav-user.tsx"),
        templates.components.sidebar.nav.user.template("", {})
      ),
      writeFile(
        join(outputPath, "components/sidebar/app-sidebar.tsx"),
        templates.components.sidebar.default.template("", {
          models: version.models,
        })
      ),

      // Theme
      writeFile(
        join(outputPath, "components/theme/provider.tsx"),
        templates.components.theme.provider.template("", {})
      ),
      writeFile(
        join(outputPath, "components/theme/toggle.tsx"),
        templates.components.theme.toggle.template("", {})
      ),

      // UI
      writeFile(
        join(outputPath, "components/ui/container.tsx"),
        templates.components.ui.container.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/data-table.tsx"),
        templates.components.ui.dataTable.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/form-ui.tsx"),
        templates.components.form.default.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/dynamic-input.tsx"),
        templates.components.ui.dynamicInput.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/date-input.tsx"),
        templates.components.ui.dateInput.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/reference-input.tsx"),
        templates.components.ui.referenceInput.template("", {})
      ),
      writeFile(
        join(outputPath, "components/ui/number-input.tsx"),
        templates.components.ui.numberInput.template("", {})
      ),

      // Lib
      // DB
      writeFile(
        join(outputPath, "lib/db.ts"),
        templates.util.db.template("", {})
      ),
      // Types
      writeFile(
        join(outputPath, "lib/types/global.d.ts"),
        templates.util.types.template("", {})
      ),
      // Utils
      writeFile(
        join(outputPath, "lib/utils.ts"),
        templates.util.default.template("", {})
      ),
      // Session
      writeFile(
        join(outputPath, "lib/session.ts"),
        templates.util.session.template("", {})
      ),
      // DAL
      writeFile(
        join(outputPath, "lib/dal.ts"),
        templates.util.dal.template("", {})
      ),

      // Middlewares
      writeFile(
        join(outputPath, "middleware.ts"),
        templates.middleware.auth.template("", {})
      ),
    ]);

    // delete root page.tsx
    await unlink(join(outputPath, "app/page.tsx"), (err) => {
      if (err) {
        console.error("Sayfa silinirken hata oluştu:", err);
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Kod üretimi sırasında hata: ", error);
    return { success: false, error: error.message };
  }
}
