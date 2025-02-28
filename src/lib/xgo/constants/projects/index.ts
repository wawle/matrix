import { IModel } from "@/lib/models/model";
import { PageNode } from "@/lib/types/xgo";

export const templateBuilder = {
  initiate: (
    template: "crm",
    props: { projectName: string; version: string; models: IModel[] }
  ) => {
    const { projectName, version, models } = props;

    return templateBuilder[template]({ projectName, version, models });
  },
  crm: (props: { projectName: string; version: string; models: IModel[] }) => {
    const { projectName, version, models } = props;
    // Model-specific sayfaları oluştur
    const modelPages: PageNode[] = models.map((model) => {
      const routeName = model.name.toLowerCase();
      return {
        name: `${routeName}s`,
        children: [
          {
            name: "not-found",
            template: "not-found",
          },
          {
            name: "loading",
            template: "loading",
          },
          {
            name: "error",
            template: "error",
          },
          {
            name: "page",
            template: "page",
            props: {
              children: [
                {
                  name: `${model.name}List`,
                  template: "ui.list",
                  props: {
                    modelName: model.name,
                    defaultColumnVisibility: model.fields
                      .filter(
                        (field) =>
                          field.name !== "id" &&
                          field.name !== "_id" &&
                          field.name !== "__v"
                      )
                      .reduce((acc: any, field) => {
                        acc[field.name] = true;
                        return acc;
                      }, {}),
                  },
                },
              ],
            },
          },
          {
            name: `[${routeName}Id]`,
            children: [
              {
                name: "not-found",
                template: "not-found",
              },
              {
                name: "loading",
                template: "loading",
              },
              {
                name: "error",
                template: "error",
              },
              {
                name: "page",
                template: "page",
                props: {
                  children: [
                    {
                      name: `${model.name}Edit`,
                      template: "ui.edit",
                      props: {
                        dynamics: {
                          [`${routeName}Id`]: `params.${routeName}Id`,
                        },
                        modelName: model.name,
                        fields: model.fields,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
    });

    const adminDashboardPages: PageNode[] = [
      {
        name: "(root)",
        children: [
          {
            name: "layout",
            template: "layout",
            props: {
              children: [
                {
                  name: "ThemeLayout",
                  template: "theme.layout",
                  props: {
                    children: "{children}",
                  },
                },
              ],
            },
          },
          {
            name: "(auth)",
            children: [
              {
                name: "login",
                children: [
                  {
                    name: "not-found",
                    template: "not-found",
                  },
                  {
                    name: "loading",
                    template: "loading",
                  },
                  {
                    name: "error",
                    template: "error",
                  },
                  {
                    name: "page",
                    template: "page",
                    props: {
                      children: [
                        {
                          name: "LoginForm",
                          template: "form.login",
                          props: {
                            projectName,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              {
                name: "register",
                children: [
                  {
                    name: "not-found",
                    template: "not-found",
                  },
                  {
                    name: "loading",
                    template: "loading",
                  },
                  {
                    name: "error",
                    template: "error",
                  },
                  {
                    name: "page",
                    template: "page",
                    props: {
                      children: [
                        {
                          name: "RegisterForm",
                          template: "form.register",
                          props: {
                            projectName,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "admin",
            children: [
              {
                name: "not-found",
                template: "not-found",
              },
              {
                name: "loading",
                template: "loading",
              },
              {
                name: "error",
                template: "error",
              },
              {
                name: "layout",
                template: "layout",
                props: {
                  children: [
                    {
                      name: "SidebarLayout",
                      template: "sidebar.layout",
                      props: {
                        projectName,
                        version,
                        children: "{children}",
                      },
                    },
                  ],
                },
              },
              {
                name: "page",
                template: "page",
                props: {
                  children: [
                    {
                      name: "DashboardCard",
                      template: "ui.card",
                      props: {
                        title: "Dashboard Card",
                        className: "p-4",
                        children: [
                          {
                            name: "DashboardButton",
                            template: "ui.button",
                            props: {
                              text: "Click me",
                              onClick: "() => console.log('clicked')",
                              children: "Click me",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                name: "profile",
                children: [
                  {
                    name: "page",
                    template: "page",
                  },
                  {
                    name: "not-found",
                    template: "not-found",
                  },
                  {
                    name: "loading",
                    template: "loading",
                  },
                  {
                    name: "error",
                    template: "error",
                  },
                ],
              },
              {
                name: "settings",
                children: [
                  {
                    name: "page",
                    template: "page",
                  },
                  {
                    name: "not-found",
                    template: "not-found",
                  },
                  {
                    name: "loading",
                    template: "loading",
                  },
                  {
                    name: "error",
                    template: "error",
                  },
                ],
              },
              ...modelPages,
            ],
          },
          {
            name: "(user)",
            children: [
              {
                name: "layout",
                template: "layout",
                props: {
                  children: "{children}",
                },
              },
              {
                name: "page",
                template: "page",
              },
            ],
          },
        ],
      },
    ];
    return adminDashboardPages;
  },
};
