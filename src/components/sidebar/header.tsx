import { NavActions } from "@/components/sidebar/nav-actions";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

interface Props {
  title: string;
}

const Header = (props: Props) => {
  const { title } = props;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Image src="/matrix.png" alt="Matrix" width={32} height={32} />
        <Breadcrumb>
          <BreadcrumbList>
            <Separator orientation="vertical" className="mr-2 h-4" />

            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  );
};

export default Header;
