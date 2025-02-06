import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { fetchAgents } from "@/lib/actions/agent";
import { userSidebarData } from "@/lib/constants/data";
import { Bot } from "lucide-react";
import Image from "next/image";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: agents } = await fetchAgents();
  const sidebarData = {
    ...userSidebarData,
    navPrimary: [
      {
        title: "Agents",
        url: "/agents",
        icon: <Bot />,
        isActive: false,
        items: agents.data.map((agent) => ({
          title: agent.name,
          url: `/agents/${agent.id}`,
          icon: (
            <Image
              src={agent.photo}
              alt={agent.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          ),
        })),
      },
    ],
  };
  return (
    <section>
      <SidebarLayout sidebarData={sidebarData}>{children}</SidebarLayout>
    </section>
  );
}
