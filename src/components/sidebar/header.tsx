import { NavActions } from "@/components/sidebar/nav-actions";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import PathBreadcrumb from "./path-breadcrumb";

interface Props {
  plain?: boolean;
}

const Header = (props: Props) => {
  const { plain = false } = props;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        {!plain && (
          <>
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        <Link href="/">
          <Image src="/matrix.png" alt="Matrix" width={32} height={32} />
        </Link>
        <PathBreadcrumb />
      </div>
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  );
};

export default Header;
