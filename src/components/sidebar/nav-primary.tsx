"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { INavItem } from "@/lib/constants/data";
import Link from "next/link";
import { Button } from "../ui/button";

export function NavPrimary({ items }: { items: INavItem[] }) {
  return items.map((item) => (
    <SidebarGroup key={item.title}>
      <SidebarGroupLabel>
        <h2 className="text-lg font-semibold tracking-tight">{item.title}</h2>
      </SidebarGroupLabel>
      <NavItem items={item.items || []} />
    </SidebarGroup>
  ));
}

const NavItem = ({ items }: { items: INavItem[] }) => {
  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 rounded-md font-semibold text-sm text-muted-foreground"
                >
                  {item.icon}
                  <span className="line-clamp-1">{item.title}</span>
                </Button>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
