import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { userSidebarData } from "@/lib/constants/data";
import { authSession } from "@/lib/dal";
import { redirect } from "next/navigation";

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
      <SidebarLayout title="v1" sidebarData={userSidebarData}>
        {children}
      </SidebarLayout>
    </section>
  );
}
