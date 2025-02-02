import * as React from "react";
import { ModeToggle } from "@/components/theme/toggle";
import { NavUser } from "@/components/sidebar/nav-user";
import { authSession } from "@/lib/dal";
import AdminToggle from "./admin-toggle";

export async function NavActions() {
  const user = await authSession();

  return (
    <div className="flex items-center gap-2 text-sm">
      <ModeToggle />
      {user?.role === "admin" && <AdminToggle />}
      <NavUser user={user} />
    </div>
  );
}
