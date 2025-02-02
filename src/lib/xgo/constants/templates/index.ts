// Routes
import { route } from "./routes/route";
import { routeId } from "./routes/route-id";
import { login } from "./routes/auth/login";
import { register } from "./routes/auth/register";
import { logout } from "./routes/auth/logout";
import { me } from "./routes/auth/me";

// Components
import { card } from "./components/ui/card";
import { themeLayout } from "./components/theme/layout";
import { button } from "./components/ui/button";
import { themeProvider } from "./components/theme/provider";
import { themeToggle } from "./components/theme/toggle";
import { container } from "./components/ui/container";
import { list } from "./components/ui/list";
import { dataTable } from "./components/ui/data-table";
import { sidebar } from "./components/sidebar/app-sidebar";
import { edit } from "./components/ui/edit";
import { sidebarLayout } from "./components/sidebar/sidebar-layout";
import { navMain } from "./components/sidebar/nav-main";
import { navSecondary } from "./components/sidebar/nav-secondary";
import { navModels } from "./components/sidebar/nav-models";
import { navActions } from "./components/sidebar/nav-actions";
import { navUser } from "./components/sidebar/nav-user";
import { form } from "./components/forms/form";
import { loginForm } from "./components/forms/login-form";
import { registerForm } from "./components/forms/register-form";

// Pages
import { layout } from "./pages/layout";
import { page } from "./pages/page";
import { loading } from "./pages/loading";
import { error } from "./pages/error";
import { notFound } from "./pages/not-found";

// Utils
import { session } from "./utils/session";
import { dal } from "./utils/dal";
import { env } from "./utils/env";
import { eslint } from "./utils/eslint";
import { db } from "./utils/db";
import { types } from "./utils/types";
import { globals } from "./utils/globals";
import { tailwind } from "./utils/tailwind";
import { utils } from "./utils";

// Lib
// Schemas
import { schema } from "./schemas/default";
import { authSchema } from "./schemas/auth";
// Services
import { service } from "./services/default";
import { authService } from "./services/auth";
// Actions
import { action } from "./actions/default";
import { authAction } from "./actions/auth";
// Models
import { model } from "./models/model";

// Middlewares
import { middleware } from "./middlewares/default";
import { authMiddleware } from "./middlewares/auth";
import { postman } from "./pages/postman";

const templates = {
  components: {
    // Theme
    theme: {
      layout: themeLayout,
      provider: themeProvider,
      toggle: themeToggle,
    },
    // UI
    ui: {
      card: card,
      button: button,
      container: container,
      dataTable: dataTable,
      list: list,
      edit: edit,
    },
    // Form
    form: {
      default: form,
      login: loginForm,
      register: registerForm,
    },
    // Sidebar
    sidebar: {
      default: sidebar,
      layout: sidebarLayout,
      nav: {
        main: navMain,
        secondary: navSecondary,
        models: navModels,
        actions: navActions,
        user: navUser,
      },
    },
  },
  page: {
    default: page,
    layout,
    loading,
    error,
    notFound,
    postman,
  },
  middleware: {
    default: middleware,
    auth: authMiddleware,
  },
  util: {
    eslint,
    db,
    session,
    dal,
    env,
    types,
    globals,
    tailwind,
    default: utils,
  },
  route: {
    default: route,
    id: routeId,
    auth: {
      login,
      register,
      logout,
      me,
    },
  },
  model: {
    default: model,
  },
  action: {
    default: action,
    auth: authAction,
  },
  service: {
    default: service,
    auth: authService,
  },
  schema: {
    default: schema,
    auth: authSchema,
  },
};

export default templates;
