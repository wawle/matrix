import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { IFlow } from "@/lib/models/flow";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { AgentCard } from "./agent-card";
import { Edit, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  flow: IFlow;
}

const FlowCard = ({ flow, className, ...props }: FlowCardProps) => {
  return (
    <Card
      className={cn("space-y-3 overflow-hidden mt-2 p-4", className)}
      {...props}
    >
      <CardHeader className="p-0">
        <div className="flex justify-between">
          <div>
            <CardTitle>{flow.name}</CardTitle>
            <CardDescription>{flow.description}</CardDescription>
          </div>
          <Link href={`/workflows/${flow.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Eye className="w-2 h-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {flow.steps.map((step) => (
              <AgentCard
                key={step.agent.name}
                agent={step.agent}
                className="w-[250px]"
                aspectRatio="portrait"
                width={250}
                height={330}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FlowCard;
