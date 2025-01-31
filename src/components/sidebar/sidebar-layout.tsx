import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ISidebarData } from "@/lib/constants/data";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  title: string;
  sidebarData: ISidebarData;
  children: React.ReactNode;
}

export async function SidebarLayout(props: Props) {
  const { children, title, sidebarData } = props;
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} />
      <SidebarInset className="h-screen max-h-screen">
        <Header title={title} />
        <div className="flex flex-1 flex-col gap-4">
          <ScrollArea className="h-[calc(100vh-56px)]">{children}</ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
