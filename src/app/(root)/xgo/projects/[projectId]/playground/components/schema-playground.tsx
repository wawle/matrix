/**
 * @file SchemaPlayground.tsx
 * @description Veritabanı şema tasarımı için görsel bir playground sağlayan ana bileşen.
 * Bu bileşen, kullanıcıların veritabanı şemalarını görsel olarak oluşturmasına,
 * düzenlemesine ve yönetmesine olanak tanır.
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

// Alt bileşen importları
import { SchemaNode } from "./schema-node";
import { SchemaHeader } from "./schema-header";
import { SchemaCanvas } from "./schema-canvas";
import { SchemaSidebar } from "./schema-sidebar";
import { SchemaDialogs } from "./schema-dialogs";
import { IVersion } from "@/lib/models/version";
import { IProject } from "@/lib/models/project";
import { toast } from "sonner";
import { updateProjectAction } from "@/lib/actions/project";
import { templates } from "@/lib/constants/templates";
import {
  deleteVersionAction,
  generateAppAction,
  generatePromptForVersion,
  generateVersionAction,
  generateVersionFromTemplate,
  setAutoSaveState,
  updateAppFromVersion,
} from "@/lib/actions/version";
import { convertTemplateToVersion } from "@/lib/utils";
import { INode } from "@/lib/models/node";
import { IEdge } from "@/lib/models/edge";

/**
 * @interface Props
 * @description SchemaPlayground bileşeninin props arayüzü
 * @property {ITemplate[]} templates - Mevcut şema şablonları listesi
 * @property {ITemplate} defaultTemplate - Varsayılan olarak yüklenecek şablon
 * @property {IProject} project - Aktif proje bilgileri
 * @property {boolean} defaultAutoSave - Varsayılan otomatik kaydetme özelliği
 */
interface Props {
  versions: IVersion[];
  defaultVersion: IVersion;
  project: IProject;
  defaultAutoSave: boolean;
}

/**
 * @component SchemaPlayground
 * @description Veritabanı şema tasarımı için ana bileşen
 * Şemaların görsel olarak tasarlanmasını, düzenlenmesini ve yönetilmesini sağlar
 */
export default function SchemaPlayground({
  versions,
  defaultVersion,
  project,
  defaultAutoSave,
}: Props) {
  // Genel durum yönetimi
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(
    defaultVersion.id as string
  );
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(defaultAutoSave);
  const [initialVersion, setInitialVersion] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({
    nodes: defaultVersion.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onWidthChange: (width: number) => updateNodeDimensions(node.id, width),
        onHeightChange: (height: number) =>
          updateNodeDimensions(node.id, undefined, height),
      },
    })),
    edges: defaultVersion.edges,
  });

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

  // ReactFlow durumları
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultVersion.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onWidthChange: (width: number) => updateNodeDimensions(node.id, width),
        onHeightChange: (height: number) =>
          updateNodeDimensions(node.id, undefined, height),
      },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    defaultVersion.edges.map((edge) => ({
      ...edge,
      style: {
        stroke: "hsl(var(--primary))",
      },
    }))
  );

  // Seçim ve düzenleme durumları
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedField, setSelectedField] = useState<any | null>(null);
  const [isEditingField, setIsEditingField] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // Dialog durumları
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isAIPromptDialogOpen, setIsAIPromptDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Yeni modül ve bağlantı durumları
  const [newModule, setNewModule] = useState<{
    name: string;
    description: string;
    isActive: boolean;
  }>({
    name: "",
    description: "",
    isActive: true,
  });
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );
  const [newConnectionType, setNewConnectionType] = useState<
    "oneToOne" | "oneToMany" | "manyToMany"
  >("oneToOne");

  // Sağ tık menüsü durumu
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  // AI ile ilgili durumlar
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);

  // Silme işlemi durumları
  const [isDeleting, setIsDeleting] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);

  // App oluşturma işlemi durumları
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);

  const handleAutoSaveChange = useCallback(async (state: boolean) => {
    setIsAutoSaveEnabled(state);
    await setAutoSaveState(state);
  }, []);

  /**
   * @function updateProject
   * @description Projeyi güncelleyerek değişiklikleri kaydeder
   */
  const updateProject = useCallback(async () => {
    const selectedVersion = versions.find((t) => t.id === selectedPreset);

    // If selected version is not found, generate a new version from template
    if (!selectedVersion) {
      // Find the selected template
      const selectedTemplate = templates.find((t) => t.id === selectedPreset);

      // If selected template is not found, show an error message
      if (!selectedTemplate) {
        toast.error("Seçili şablon bulunamadı.");
        return;
      }

      // Generate a new version from the selected template
      const result = await generateVersionFromTemplate(
        selectedTemplate,
        project.id
      );
      if (result.success && result.version) {
        setSelectedPreset(result.version.id);

        toast.success("Yeni şema oluşturuldu.");
      } else {
        toast.error("Yeni şema oluşturulurken bir hata oluştu.");
      }
      return;
    }

    try {
      const updatedVersion = {
        ...selectedVersion,
        nodes: nodes as INode[],
        edges: edges as IEdge[],
      };
      const result = await updateAppFromVersion(updatedVersion, project.id);
      if (result.success) {
        toast.success("Proje başarıyla güncellendi.");
      }
    } catch (error) {
      toast.error("Proje güncellenirken bir hata oluştu.");
    }
  }, [selectedPreset, project.id, toast, nodes, edges]);

  /**
   * @function hasVersionChanged
   * @description Şablonda değişiklik olup olmadığını kontrol eder
   * @returns {boolean} Şablonda değişiklik varsa true, yoksa false döner
   */
  const hasVersionChanged = useCallback(() => {
    const currentVersion = {
      nodes: nodes,
      edges: edges,
    };

    return JSON.stringify(initialVersion) !== JSON.stringify(currentVersion);
  }, [nodes, edges, initialVersion]);

  /**
   * @function toggleFullscreen
   * @description Tam ekran modunu açıp kapatır
   */
  const toggleFullscreen = useCallback(() => {
    const reactFlowWrapper = document.querySelector(".react-flow-wrapper");
    if (!isFullscreen) {
      if (reactFlowWrapper?.requestFullscreen) {
        reactFlowWrapper.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  /**
   * @effect
   * @description Tam ekran modu ve klavye kısayolları için event listener'ları yönetir
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      } else if (event.key.toLowerCase() === "f") {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          toggleFullscreen();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleFullscreen]);

  /**
   * @effect
   * @description Otomatik kaydetme özelliğini yönetir
   * Değişiklikler olduğunda belirli aralıklarla projeyi kaydeder
   */
  useEffect(() => {
    if (!isAutoSaveEnabled) return;

    const autoSaveInterval = setInterval(async () => {
      if (hasVersionChanged()) {
        await updateProject();
        setInitialVersion({ nodes: nodes, edges: edges });
        toast.success("Değişiklikler otomatik olarak kaydedildi.");
      }
    }, 3 * 60 * 1000);

    return () => clearInterval(autoSaveInterval);
  }, [
    isAutoSaveEnabled,
    hasVersionChanged,
    nodes,
    edges,
    updateProject,
    toast,
  ]);

  /**
   * @constant nodeTypes
   * @description ReactFlow için özel node tiplerini tanımlar
   */
  const nodeTypes = useMemo(
    () => ({
      schema: SchemaNode,
    }),
    []
  );

  /**
   * @function onPresetChange
   * @description Seçili şablonu değiştirir ve yeni şablonu yükler
   * @param {string} value - Seçilen şablon ID'si
   */
  const onPresetChange = useCallback(
    (value: string) => {
      const defaultTemplate = templates.find((t) => t.id === value);
      if (defaultTemplate) {
        const clonedNodes = JSON.parse(JSON.stringify(defaultTemplate.nodes));
        const nodesWithHandlers = clonedNodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onWidthChange: (width: number) =>
              updateNodeDimensions(node.id, width),
            onHeightChange: (height: number) =>
              updateNodeDimensions(node.id, undefined, height),
          },
        }));
        setNodes(nodesWithHandlers);
        setEdges(JSON.parse(JSON.stringify(defaultTemplate.edges)));
        setSelectedPreset(value);
      }

      const selectedVersion = versions.find((t) => t.id === value);
      if (selectedVersion) {
        setNodes(selectedVersion.nodes);
        setEdges(selectedVersion.edges);
        setSelectedPreset(value);
      }
    },
    [templates, selectedPreset, updateNodeDimensions]
  );

  /**
   * @function onConnect
   * @description İki node arasında bağlantı oluşturma işlemini başlatır
   * @param {Connection} connection - Bağlantı detayları
   */
  const onConnect = useCallback((connection: Connection) => {
    setPendingConnection(connection);
    setIsConnectionDialogOpen(true);
  }, []);

  /**
   * @function createConnection
   * @description İki node arasında bağlantıyı oluşturur
   */
  const createConnection = useCallback(() => {
    if (!pendingConnection?.source || !pendingConnection?.target) return;
    const newEdge: Edge = {
      id: `${pendingConnection.source}-${pendingConnection.target}`,
      source: pendingConnection.source,
      target: pendingConnection.target,
      animated: true,
      label:
        newConnectionType === "oneToOne"
          ? "1:1"
          : newConnectionType === "oneToMany"
          ? "1:N"
          : "N:N",
      data: {
        relationType: newConnectionType,
      },
      style: { stroke: "hsl(var(--primary))" },
    };

    setEdges((eds) => [...eds, newEdge]);
    setIsConnectionDialogOpen(false);
    setPendingConnection(null);
    setNewConnectionType("oneToOne");
  }, [pendingConnection, newConnectionType]);

  /**
   * @function onSelectionChange
   * @description Node seçimi değiştiğinde tetiklenir
   * @param {Object} param0 - Seçim değişikliği parametreleri
   * @param {Node[]} param0.nodes - Seçili node'lar
   */
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selected = selectedNodes[0];
      if (selected) {
        const currentNode = nodes.find((n) => n.id === selected.id);
        setSelectedNode(currentNode || null);
      } else {
        setSelectedNode(null);
      }
      setSelectedField(null);
      setIsEditingField(false);
    },
    [nodes]
  );

  /**
   * @function addNewModule
   * @description Yeni bir modül (node) ekler
   */
  const addNewModule = useCallback(() => {
    if (!newModule.name) return;

    const newNode: Node = {
      id: Date.now().toString(),
      type: "schema",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        name: newModule.name,
        description: newModule.description,
        isActive: newModule.isActive,
        fields: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewModule({
      name: "",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(false);

    setTimeout(() => {
      setSelectedNode(newNode);
    }, 100);
  }, [newModule]);

  /**
   * @function addNewField
   * @description Seçili node'a yeni bir alan ekler
   */
  const addNewField = useCallback(() => {
    if (!selectedNode) return;

    const newField = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
    };

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              fields: [...node.data.fields, newField],
            },
          };
        }
        return node;
      })
    );

    setSelectedField(newField);
    setIsEditingField(true);
  }, [selectedNode]);

  /**
   * @function updateField
   * @description Bir alanı günceller
   * @param {string} fieldId - Güncellenecek alanın ID'si
   * @param {any} updatedField - Güncellenmiş alan verileri
   */
  const updateField = useCallback(
    (fieldId: string, updatedField: any) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                fields: node.data.fields.map((field: any) =>
                  field.id === fieldId ? updatedField : field
                ),
              },
            };
          }
          return node;
        })
      );
      setIsEditingField(false);
      setSelectedField(null);
    },
    [selectedNode]
  );

  /**
   * @function deleteField
   * @description Bir alanı siler
   * @param {string} fieldId - Silinecek alanın ID'si
   */
  const deleteField = useCallback((fieldId: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              fields: node.data.fields.filter((f: any) => f.id !== fieldId),
            },
          };
        }
        return node;
      })
    );
  }, []);

  /**
   * @function deleteModule
   * @description Bir modülü ve ilişkili tüm bağlantılarını siler
   * @param {string} moduleId - Silinecek modülün ID'si
   */
  const deleteModule = useCallback((moduleId: string) => {
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== moduleId && edge.target !== moduleId)
    );

    setNodes((nds) => nds.filter((node) => node.id !== moduleId));

    if (selectedNode?.id === moduleId) {
      setSelectedNode(null);
    }
  }, []);

  /**
   * @function updateNode
   * @description Bir node'u günceller
   * @param {any} updates - Güncellenecek veriler
   */
  const updateNode = useCallback((updates: any) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  }, []);

  /**
   * @function updateRelation
   * @description İki node arasındaki ilişkiyi günceller
   * @param {string} edgeId - Güncellenecek ilişkinin ID'si
   * @param {any} updates - Güncellenecek veriler
   */
  const updateRelation = useCallback((edgeId: string, updates: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...updates,
            },
            label:
              updates.relationType === "oneToOne"
                ? "1:1"
                : updates.relationType === "oneToMany"
                ? "1:N"
                : "N:N",
          };
        }
        return edge;
      })
    );
  }, []);

  /**
   * @function deleteRelation
   * @description İki node arasındaki ilişkiyi siler
   * @param {string} edgeId - Silinecek ilişkinin ID'si
   */
  const deleteRelation = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, []);

  /**
   * @function generateMongoDBSchema
   * @description Seçili node için MongoDB şeması oluşturur ve panoya kopyalar
   */
  const generateMongoDBSchema = useCallback(() => {
    if (!selectedNode) return;

    const schema = {
      name: selectedNode.data.label,
      fields: selectedNode.data.fields.reduce((acc: any, field: any) => {
        let fieldDef: any = {
          type: field.type === "reference" ? "ObjectId" : field.type,
          required: field.required,
        };

        if (field.type === "reference") {
          fieldDef.ref = field.label || "Schema";
        }

        if (field.validation) {
          if (field.validation.min) fieldDef.min = field.validation.min;
          if (field.validation.max) fieldDef.max = field.validation.max;
          if (field.validation.pattern)
            fieldDef.match = field.validation.pattern;
        }

        acc[field.name] = fieldDef;
        return acc;
      }, {}),
      timestamps: true,
    };

    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success("MongoDB Şeması Kopyalandı");
  }, [selectedNode]);

  /**
   * @function generateTypeScriptTypes
   * @description Seçili node için TypeScript tiplerini oluşturur ve panoya kopyalar
   */
  const generateTypeScriptTypes = useCallback(() => {
    if (!selectedNode) return;

    const typeMap: { [key: string]: string } = {
      string: "string",
      number: "number",
      date: "Date",
      boolean: "boolean",
      object: "Record<string, any>",
      array: "any[]",
      reference: "string",
    };

    const interfaceName = selectedNode.data.label.replace(/\s+/g, "");
    const fields = selectedNode.data.fields
      .map((field: any) => {
        const optional = field.required ? "" : "?";
        return `  ${field.name}${optional}: ${typeMap[field.type]};`;
      })
      .join("\n");

    const typeDefinition = `interface ${interfaceName} {
${fields}
  createdAt: Date;
  updatedAt: Date;
}`;

    navigator.clipboard.writeText(typeDefinition);
    toast.success("TypeScript Tipleri Kopyalandı");
  }, [selectedNode]);

  /**
   * @function handleDeleteTemplate
   * @description Seçili şablonu siler
   */
  const handleDeleteTemplate = useCallback(async () => {
    try {
      setIsDeleting(true);
      if (!versionToDelete) return;

      const result = await deleteVersionAction(versionToDelete);

      if (result.success) {
        toast.success("Şablon Silindi");

        if (versions.length > 0) {
          const nextVersion = versions.find((t) => t.id !== versionToDelete);
          if (nextVersion) {
            setSelectedPreset(nextVersion.id);
            setNodes(nextVersion.nodes);
            setEdges(nextVersion.edges);
          }
        }
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Şablon silinirken bir hata oluştu"
      );
    } finally {
      setIsDeleting(false);
      setVersionToDelete(null);
    }
  }, [versions]);

  /**
   * @function handleGenerateSchema
   * @description AI kullanarak yeni bir şema oluşturur
   */
  const handleGenerateSchema = useCallback(async () => {
    try {
      setIsGenerating(true);
      const result = await generateVersionAction(
        promptText,
        project.id,
        isUpdatingExisting ? nodes : [],
        isUpdatingExisting ? selectedPreset : undefined
      );

      if (result.success && result.version) {
        const flattenedNodes = JSON.parse(
          JSON.stringify(
            result.version.nodes.reduce((acc: any[], node: any) => {
              if (node.data.nodes) {
                return [...acc, ...node.data.nodes];
              }
              return [...acc, node];
            }, [])
          )
        );

        const flattenedEdges = JSON.parse(
          JSON.stringify(
            result.version.nodes.reduce((acc: any[], node: any) => {
              if (node.data.edges) {
                return [...acc, ...node.data.edges];
              }
              return [...acc, ...(result.version.edges || [])];
            }, [])
          )
        );

        setNodes(flattenedNodes);
        setEdges(flattenedEdges);
        setSelectedPreset(result.version.id);
        setIsAIPromptDialogOpen(false);
        toast.success("Şema Oluşturuldu");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Şema oluşturulurken bir hata oluştu"
      );
    } finally {
      setIsGenerating(false);
      setPromptText("");
    }
  }, [promptText, project.id]);

  /**
   * @function handleOptimizePrompt
   * @description AI prompt'unu optimize eder
   */
  const handleOptimizePrompt = useCallback(async () => {
    try {
      setIsOptimizing(true);
      const result = await generatePromptForVersion(promptText);
      if (result.success) {
        setPromptText(result.prompt);
        toast.success("Prompt optimize edildi");
        setIsPromptExpanded(true);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Prompt oluşturulurken bir hata oluştu");
    } finally {
      setIsOptimizing(false);
    }
  }, [promptText, toast]);

  /**
   * @function onNodeContextMenu
   * @description Node üzerinde sağ tıklama menüsünü gösterir
   * @param {React.MouseEvent} event - Mouse olayı
   * @param {Node} node - Sağ tıklanan node
   */
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenu({
        id: node.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  /**
   * @function onPaneClick
   * @description Canvas üzerine tıklandığında sağ tıklama menüsünü kapatır
   */
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  /**
   * @function onEdgeClick
   * @description Edge'e tıklandığında seçili edge'i günceller
   * @param {React.MouseEvent} event - Mouse olayı
   * @param {Edge} edge - Tıklanan edge
   */
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  }, []);

  const onGenerateApp = useCallback(async () => {
    setIsGeneratingApp(true);
    return await generateAppAction(selectedPreset, project.id)
      .then((result) => {
        if (result.success) {
          toast.success("App oluşturuldu");
        } else {
          toast.error(result.error);
        }
      })
      .finally(() => {
        setIsGeneratingApp(false);
      });
  }, []);

  return (
    <div className={`flex flex-col h-[calc(100vh-65px)]`}>
      {/* Header */}
      <SchemaHeader
        selectedPreset={selectedPreset}
        versions={versions}
        isAutoSaveEnabled={isAutoSaveEnabled}
        isGeneratingApp={isGeneratingApp}
        onPresetChange={onPresetChange}
        onAutoSaveChange={handleAutoSaveChange}
        onSave={updateProject}
        onExport={() => {}}
        onDelete={(versionId) => {
          setVersionToDelete(versionId);
          setIsDeleteModalOpen(true);
        }}
        onGenerateMongoSchema={generateMongoDBSchema}
        onGenerateTypeScript={generateTypeScriptTypes}
        onNewSchema={() => setIsDialogOpen(true)}
        onAIPrompt={() => setIsAIPromptDialogOpen(true)}
        onGenerateApp={onGenerateApp}
        selectedNode={selectedNode}
      />

      {/* Main Content */}
      <div className="h-[calc(100vh-120px)]">
        {/* Canvas Area */}
        <SchemaCanvas
          nodes={nodes}
          edges={edges}
          isFullscreen={isFullscreen}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          toggleFullscreen={toggleFullscreen}
          nodeTypes={nodeTypes}
          contextMenu={contextMenu}
          onDeleteModule={deleteModule}
          onEditModule={(id) => {
            const node = nodes.find((n) => n.id === id);
            if (node) {
              setSelectedNode(node);
              setIsOpen(true);
            }
            setContextMenu(null);
          }}
          onDeleteEdge={deleteRelation}
          onEditEdge={(id) => {
            const edge = edges.find((e) => e.id === id);
            if (edge) {
              setPendingConnection({
                source: edge.source,
                target: edge.target,
                sourceHandle: null,
                targetHandle: null,
              });
              setNewConnectionType(edge.data?.relationType || "oneToOne");
              setIsConnectionDialogOpen(true);
            }
            setContextMenu(null);
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isConnectionDialogOpen={isConnectionDialogOpen}
          setIsConnectionDialogOpen={setIsConnectionDialogOpen}
        />

        {/* Sidebar */}
        <SchemaSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedNode={selectedNode}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          isEditingField={isEditingField}
          setIsEditingField={setIsEditingField}
          nodes={nodes}
          edges={edges}
          onUpdateNode={updateNode}
          onDeleteNode={deleteModule}
          onUpdateField={updateField}
          onDeleteField={deleteField}
          onAddField={addNewField}
          onUpdateRelation={updateRelation}
          onDeleteRelation={deleteRelation}
        />

        {/* Dialogs */}
        <SchemaDialogs
          // Yeni Şema Dialog'u
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          newModule={newModule}
          setNewModule={setNewModule}
          onAddNewModule={addNewModule}
          // İlişki Dialog'u
          isConnectionDialogOpen={isConnectionDialogOpen}
          setIsConnectionDialogOpen={setIsConnectionDialogOpen}
          newConnectionType={newConnectionType}
          setNewConnectionType={setNewConnectionType}
          onCreateConnection={createConnection}
          // AI Prompt Dialog'u
          isAIPromptDialogOpen={isAIPromptDialogOpen}
          setIsAIPromptDialogOpen={setIsAIPromptDialogOpen}
          isPromptExpanded={isPromptExpanded}
          setIsPromptExpanded={setIsPromptExpanded}
          promptText={promptText}
          setPromptText={setPromptText}
          isGenerating={isGenerating}
          isOptimizing={isOptimizing}
          onOptimizePrompt={handleOptimizePrompt}
          onGenerateSchema={handleGenerateSchema}
          // Silme Dialog'u
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          isDeleting={isDeleting}
          onConfirmDelete={handleDeleteTemplate}
          isUpdatingExisting={isUpdatingExisting}
          setIsUpdatingExisting={setIsUpdatingExisting}
        />
      </div>
    </div>
  );
}
