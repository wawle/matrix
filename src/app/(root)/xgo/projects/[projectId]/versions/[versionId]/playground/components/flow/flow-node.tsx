import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { IAgent } from "@/lib/models/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlowNodeMenu } from "./flow-node-menu";

interface FlowNodeProps {
  data: IAgent & {
    onEdit: () => void;
  };
  selected: boolean;
}

export const FlowNode = memo(({ data, selected }: FlowNodeProps) => {
  return (
    <div>
      <Card
        className={`w-[300px] shadow-lg relative ${
          selected ? "border-2 border-primary" : ""
        }`}
      >
        <Handle type="target" position={Position.Left} />
        <CardHeader>
          <CardTitle className="text-lg">{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Model</p>
            <p className="text-sm text-muted-foreground">{data.model_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Instructions</p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {data.instructions}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Settings</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm">{data.temperature || 0.7}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Max Tokens</p>
                <p className="text-sm">{data.max_tokens || 1000}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <Handle type="source" position={Position.Right} />
      </Card>
      {selected && <FlowNodeMenu onEdit={data.onEdit} />}
    </div>
  );
});
