"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut, Shield } from "lucide-react";

const AdminToggle = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  const toggleAdmin = () => {
    if (isAdmin) {
      push("/");
    } else {
      push("/admin");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleAdmin}>
      {isAdmin ? <LogOut /> : <Shield />}
    </Button>
  );
};

export default AdminToggle;
