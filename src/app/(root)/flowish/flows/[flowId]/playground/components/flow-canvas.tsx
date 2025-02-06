import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Panel,
  useReactFlow,
} from "reactflow";
import { Button } from "@/components/ui/button";

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  isFullscreen: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onSelectionChange: any;
  onEdgeDelete: (edgeId: string) => void;
  nodeTypes: NodeTypes;
}

export const FlowCanvas = ({
  nodes,
  edges,
  isFullscreen,
  onSelectionChange,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeDelete,
}: FlowCanvasProps) => {
  const { fitView } = useReactFlow();

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const shouldDelete = window.confirm(
        "Bu bağlantıyı silmek istiyor musunuz?"
      );
      if (shouldDelete) {
        onEdgeDelete(edge.id);
      }
    },
    [onEdgeDelete]
  );

  const handleFitView = useCallback(() => {
    fitView({ duration: 500 });
  }, [fitView]);

  return (
    <div
      className={`react-flow-wrapper ${
        isFullscreen ? "fixed inset-0 z-50" : "h-full"
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button variant="outline" size="sm" onClick={handleFitView}>
            Fit View
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
