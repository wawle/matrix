export const sidebar = {
  template: (name: string, props: Record<string, any>) => {
    const models = props.models || [];
    const modelsData = models.map((model: any, index: number) => ({
      name: `${model.name}s`,
      url: `/admin/${model.name.toLowerCase()}s`,
      emoji: "", // generate random emoji
    }));
    return `
"use client";

import * as React from "react";
import { NavModels } from "@/components/sidebar/nav-models";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Search, Settings2 } from "lucide-react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/admin",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
  models: ${JSON.stringify(modelsData, null, 2)},
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavModels models={data.models} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
    `;
  },
};
