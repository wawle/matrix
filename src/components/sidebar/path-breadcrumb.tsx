"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PathBreadcrumb = () => {
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/").filter((path) => path !== "");

  const getBreadcrumpPath = (index: number) => {
    return `/${breadcrumbs.slice(0, index + 1).join("/")}`;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={index} className={"flex items-center gap-1"}>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href={getBreadcrumpPath(index)}>
              <BreadcrumbPage
                className={cn(
                  "line-clamp-1 text-xs font-semibold",
                  index !== breadcrumbs.length - 1 && "text-muted-foreground"
                )}
              >
                {breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1)}
              </BreadcrumbPage>
            </Link>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PathBreadcrumb;
