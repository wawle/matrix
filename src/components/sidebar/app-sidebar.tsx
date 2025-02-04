"use client";

import * as React from "react";
import { NavPrimary } from "@/components/sidebar/nav-primary";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ISidebarData } from "@/lib/constants/data";
import Image from "next/image";

interface Props extends React.ComponentProps<typeof Sidebar> {
  data: ISidebarData;
}

export function AppSidebar({ data, ...props }: Props) {
  const { navMain, navPrimary, navSecondary } = data;
  return (
    <Sidebar variant="floating" {...props}>
      {navMain.length > 0 && (
        <SidebarHeader>
          <NavMain items={navMain} />
        </SidebarHeader>
      )}
      <SidebarContent>
        {navPrimary.length > 0 && <NavPrimary items={navPrimary} />}
        {navSecondary.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
