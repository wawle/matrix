import Image from "next/image";
import { cn } from "@/lib/utils";
import { IAgent } from "@/lib/models/agent";
import Link from "next/link";

interface AgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  agent: IAgent;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function AgentCard({
  agent,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.slug}`}>
      <div className={cn("space-y-3", className)} {...props}>
        <div className="overflow-hidden rounded-md">
          <Image
            src={agent.photo}
            alt={agent.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </div>

        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{agent.name}</h3>
          <p className="text-xs text-muted-foreground">{agent.title}</p>
        </div>
      </div>
    </Link>
  );
}
