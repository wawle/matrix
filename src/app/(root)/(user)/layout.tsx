import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { userSidebarData } from "@/lib/constants/data";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <SidebarLayout sidebarData={userSidebarData}>{children}</SidebarLayout>
    </section>
  );
}
