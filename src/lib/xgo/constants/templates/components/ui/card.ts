export const card = {
  template: (name: string, props: Record<string, any>): string => {
    const title = props.title;
    const description = props.description || "";
    const className = props.className || "";
    const children = props.children || "";
    const footer = props.footer || "";
    return `
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
      
export function ${name}() {
  return (
    <Card className={cn("", "${className}")}>
      <CardHeader>
        <CardTitle>${title}</CardTitle>
        ${
          description ? `<CardDescription>${description}</CardDescription>` : ""
        }
      </CardHeader>
      <CardContent>
        ${children}
      </CardContent>
      ${footer ? `<CardFooter>${footer}</CardFooter>` : ""}
    </Card>
  )
}
`;
  },
};
