export const navActions = {
  template: (name: string, props: Record<string, any>) => {
    return `
    import * as React from "react";
    import { ModeToggle } from "@/components/theme/toggle";
    import { NavUser } from "@/components/sidebar/nav-user";
    import { authSession } from "@/lib/dal";
    
    export async function NavActions() {
      const user = await authSession();
    
      return (
        <div className="flex items-center gap-2 text-sm">
          <ModeToggle />
          <NavUser user={user} />
        </div>
      );
    }
    
        

    `;
  },
};
