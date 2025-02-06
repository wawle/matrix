"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  useEdgesState,
  useNodesState,
  Connection,
  Node,
  Edge,
  EdgeProps,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// Alt bileşen importları
import { FlowNode } from "./flow-node";
import { FlowHeader } from "./flow-header";
import { FlowCanvas } from "./flow-canvas";
import { FlowSidebar } from "./flow-sidebar";
import { FlowDialogs } from "./flow-dialogs";
import { IAgent } from "@/lib/models/agent";
import { IFlow } from "@/lib/models/flow";

interface Props {
  agents: IAgent[];
  defaultAgent?: IAgent;
  flow: IFlow;
  defaultAutoSave: boolean;
}

type ConnectionType = "sequential" | "parallel" | "conditional";

interface CustomEdgeData {
  type: ConnectionType;
  condition?: string;
}

export default function FlowPlayground({
  agents,
  defaultAgent,
  flow,
  defaultAutoSave,
}: Props) {
  // Genel durum yönetimi
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(
    (defaultAgent?.id as string) || ""
  );
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(defaultAutoSave);

  // ReactFlow durumları
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flow.nodes.map((node: any) => {
      const flowNode = {
        ...node,
        type: "agent",
        data: {
          ...node.data,
          onWidthChange: (width: number) =>
            updateNodeDimensions(node.id, width),
          onHeightChange: (height: number) =>
            updateNodeDimensions(node.id, undefined, height),
        },
      };

      flowNode.data.onEdit = () => {
        setSelectedNode(flowNode);
        setIsEditingAgent(true);
      };

      return flowNode;
    })
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flow.edges.map((edge: any) => ({
      ...edge,
      style: {
        stroke: "hsl(var(--primary))",
      },
    }))
  );

  // Node boyutlarını güncelleme
  const updateNodeDimensions = useCallback(
    (nodeId: string, width?: number, height?: number) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...(width !== undefined && { width }),
                ...(height !== undefined && { height }),
              },
            };
          }
          return node;
        })
      );
    },
    []
  );

  // Seçim ve düzenleme durumları
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditingAgent, setIsEditingAgent] = useState(false);

  // Dialog durumları
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);

  // Yeni agent ve bağlantı durumları
  const [newAgent, setNewAgent] = useState<Partial<IAgent>>({
    name: "",
    title: "",
    instructions: "",
    is_public: false,
    model_provider: "openai",
    model_name: "gpt-3.5-turbo",
  });

  // Bağlantı durumları
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );
  const [connectionType, setConnectionType] =
    useState<ConnectionType>("sequential");
  const [connectionCondition, setConnectionCondition] = useState<string>("");

  // Node tipleri tanımı
  const nodeTypes = useMemo(
    () => ({
      agent: FlowNode,
    }),
    []
  );

  // Bağlantı oluşturma
  const onConnect = useCallback((connection: Connection) => {
    setPendingConnection(connection);
    setIsConnectionDialogOpen(true);
  }, []);

  // Bağlantı tamamlama
  const completeConnection = useCallback(
    (type: ConnectionType, condition?: string) => {
      if (!pendingConnection?.source || !pendingConnection?.target) return;

      const newEdge: Edge<CustomEdgeData> = {
        id: `${pendingConnection.source}-${pendingConnection.target}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        type: "custom",
        animated: true,
        data: {
          type,
          condition,
        },
        style: {
          stroke:
            type === "sequential"
              ? "hsl(var(--primary))"
              : type === "parallel"
              ? "hsl(var(--success))"
              : "hsl(var(--warning))",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        label: type === "sequential" ? "→" : type === "parallel" ? "⇉" : "?",
      };

      setEdges((eds) => [...eds, newEdge]);
      setPendingConnection(null);
      setConnectionType("sequential");
      setConnectionCondition("");
      setIsConnectionDialogOpen(false);
    },
    [pendingConnection]
  );

  // Edge silme
  const onEdgeDelete = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, []);

  // Edge güncelleme
  const updateEdge = useCallback(
    (edgeId: string, updates: Partial<CustomEdgeData>) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const currentData = (edge as Edge<CustomEdgeData>).data || {
              type: "sequential" as ConnectionType,
            };
            const updatedEdge: Edge<CustomEdgeData> = {
              ...edge,
              data: {
                ...currentData,
                type: updates.type || currentData.type,
                condition: updates.condition,
              },
              style: {
                ...edge.style,
                stroke:
                  updates.type === "sequential"
                    ? "hsl(var(--primary))"
                    : updates.type === "parallel"
                    ? "hsl(var(--success))"
                    : "hsl(var(--warning))",
              },
              label:
                updates.type === "sequential"
                  ? "→"
                  : updates.type === "parallel"
                  ? "⇉"
                  : "?",
            };
            return updatedEdge;
          }
          return edge;
        })
      );
    },
    []
  );

  // Node seçimi
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selected = selectedNodes[0];
      if (selected) {
        const currentNode = nodes.find((n) => n.id === selected.id);
        setSelectedNode(currentNode || null);
      } else {
        setSelectedNode(null);
      }
    },
    [nodes]
  );

  // Yeni agent ekleme
  const addNewAgent = useCallback(() => {
    if (!newAgent.name) return;

    const newNode: Node = {
      id: Date.now().toString(),
      type: "agent",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: newAgent,
    };

    setNodes((nds) => [...nds, newNode]);
    setNewAgent({
      name: "",
      title: "",
      instructions: "",
      is_public: false,
      model_provider: "openai",
      model_name: "gpt-3.5-turbo",
    });
    setIsDialogOpen(false);
  }, [newAgent]);

  // Agent güncelleme
  const updateAgent = useCallback(
    (updates: Partial<IAgent>) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
                onEdit: () => {
                  setSelectedNode(node);
                  setIsEditingAgent((prev) => !prev);
                },
              },
            };
          }
          return node;
        })
      );
    },
    [selectedNode]
  );

  // Agent silme
  const deleteAgent = useCallback((agentId: string) => {
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== agentId && edge.target !== agentId)
    );

    setNodes((nds) => nds.filter((node) => node.id !== agentId));

    if (selectedNode?.id === agentId) {
      setSelectedNode(null);
    }
  }, []);

  return (
    <ReactFlowProvider>
      <div className={`flex flex-col h-[calc(100vh-65px)]`}>
        {/* Header */}
        <FlowHeader
          selectedAgent={selectedAgent}
          agents={agents}
          isAutoSaveEnabled={isAutoSaveEnabled}
          onAgentChange={setSelectedAgent}
          onAutoSaveChange={setIsAutoSaveEnabled}
          onNewAgent={() => setIsDialogOpen(true)}
        />

        {/* Main Content */}
        <div className="h-[calc(100vh-120px)]">
          {/* Canvas Area */}
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            isFullscreen={isFullscreen}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onEdgeDelete={onEdgeDelete}
            nodeTypes={nodeTypes}
          />

          {/* Sidebar */}
          <FlowSidebar
            selectedNode={selectedNode}
            isEditingAgent={isEditingAgent}
            setIsEditingAgent={setIsEditingAgent}
            onUpdateAgent={updateAgent}
            onDeleteAgent={deleteAgent}
          />

          {/* Dialogs */}
          <FlowDialogs
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            newAgent={newAgent}
            setNewAgent={setNewAgent}
            onAddNewAgent={addNewAgent}
            isConnectionDialogOpen={isConnectionDialogOpen}
            setIsConnectionDialogOpen={setIsConnectionDialogOpen}
            connectionType={connectionType}
            setConnectionType={setConnectionType}
            connectionCondition={connectionCondition}
            setConnectionCondition={setConnectionCondition}
            onCompleteConnection={completeConnection}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
