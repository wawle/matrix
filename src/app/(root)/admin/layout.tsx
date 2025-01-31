import { authSession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { adminSidebarData } from "@/lib/constants/data";
import { SidebarLayout } from "@/components/sidebar/sidebar-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authSession();
  if (user?.role !== "admin") {
    return redirect("/");
  }
  return (
    <section>
      <SidebarLayout title="v1" sidebarData={adminSidebarData}>
        {children}
      </SidebarLayout>
    </section>
  );
}
