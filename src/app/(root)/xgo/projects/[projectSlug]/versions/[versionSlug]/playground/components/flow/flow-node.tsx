import React, { memo } from "react";
import { Handle, Node, NodeProps, Position } from "reactflow";
import { IAgentData } from "@/lib/types/xgo/agents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlowNodeMenu } from "./flow-node-menu";

export const FlowNode = memo(
  ({ data: node, selected }: NodeProps<Node<IAgentData>>) => {
    return (
      <div>
        <Card
          className={`w-[300px] shadow-lg relative ${
            selected ? "border-2 border-primary" : ""
          }`}
        >
          <Handle type="target" position={Position.Left} />
          <CardHeader>
            <CardTitle className="text-lg">{node.data.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Model</p>
              <p className="text-sm text-muted-foreground">
                {node.data.model_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Instructions</p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {node.data.instructions}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Settings</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-sm">{node.data.temperature || 0.7}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Tokens</p>
                  <p className="text-sm">{node.data.max_tokens || 1000}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <Handle type="source" position={Position.Right} />
        </Card>
        {selected && <FlowNodeMenu />}
      </div>
    );
  }
);
