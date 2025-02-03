export const container = {
  template: (name: string, props: Record<string, any>): string => {
    return `
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactElement;
  className?: string;
}

export function Container({
  title,
  description,
  actions,
  className,
  children,
}: Props) {
  return (
    <Card className={cn("p-2 shadow-none max-w-[80.8vw] m-4", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
`;
  },
};
