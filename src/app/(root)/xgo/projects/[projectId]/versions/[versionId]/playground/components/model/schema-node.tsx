"use client";

import React, { useState } from "react";
import { Handle, Position, NodeProps, Node } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Resizable } from "re-resizable";
import { SchemaNodeMenu } from "./schema-node-menu";
import { IModelData } from "@/lib/types/xgo/models";

// Field type'ları için renk ve etiket tanımlamaları
const fieldTypeBadgeVariants: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  string: { label: "String", variant: "default" },
  number: { label: "Number", variant: "secondary" },
  date: { label: "Date", variant: "outline" },
  boolean: { label: "Boolean", variant: "secondary" },
  object: { label: "Object", variant: "outline" },
  array: { label: "Array", variant: "outline" },
  reference: { label: "Reference", variant: "destructive" },
};

export const SchemaNode = React.memo(
  ({ data: node, selected }: NodeProps<Node<IModelData>>) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [width, setWidth] = useState(node.width || 300);
    const [height, setHeight] = useState<string | number>("auto");
    const [minHeight, setMinHeight] = useState(100);
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Card yüksekliğini takip et
    React.useEffect(() => {
      if (cardRef.current) {
        const updateMinHeight = () => {
          const cardHeight = cardRef.current?.offsetHeight || 100;
          setMinHeight(cardHeight);
          if (typeof height === "number" && height < cardHeight) {
            setHeight(cardHeight);
          }
        };

        updateMinHeight();
        // İçerik değiştiğinde yüksekliği güncelle
        const observer = new ResizeObserver(updateMinHeight);
        observer.observe(cardRef.current);

        return () => {
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        };
      }
    }, [isExpanded, node.data.schemas]);

    const handleResizeStop = (
      e: MouseEvent | TouchEvent,
      direction: string,
      ref: HTMLElement,
      d: { width: number; height: number }
    ) => {
      const newWidth = width + d.width;
      const newHeight = Math.max(ref.offsetHeight, minHeight);

      setWidth(newWidth);
      setHeight(newHeight);

      if (node.data.onWidthChange) {
        node.data.onWidthChange(newWidth);
      }
      if (node.data.onHeightChange) {
        node.data.onHeightChange(newHeight);
      }
    };

    return (
      <div className="flex flex-col items-center gap-3">
        <Resizable
          size={{ width, height }}
          minWidth={300}
          minHeight={minHeight}
          enable={{
            right: true,
            bottom: true,
            bottomRight: true,
          }}
          onResizeStop={handleResizeStop}
          handleStyles={{
            right: { width: "4px", right: 0, opacity: 0 },
            bottom: { height: "4px", bottom: 0, opacity: 0 },
            bottomRight: {
              width: "8px",
              height: "8px",
              right: 0,
              bottom: 0,
              opacity: 0,
            },
          }}
        >
          <Card
            className={`shadow-md transition-shadow hover:shadow-lg ${
              selected ? "ring-2 ring-primary" : ""
            } h-full overflow-hidden`}
          >
            <div ref={cardRef}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <CardTitle className="text-lg">{node.data.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {node.data.schemas.map((schema, index) => (
                      <React.Fragment key={schema.id}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-base">
                              {schema.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                fieldTypeBadgeVariants[schema.type]?.variant ||
                                "default"
                              }
                            >
                              {fieldTypeBadgeVariants[schema.type]?.label ||
                                schema.type}
                            </Badge>

                            {schema?.required ? (
                              <Badge className="h-5">Zorunlu</Badge>
                            ) : (
                              <Badge variant="secondary" className="h-5">
                                Opsiyonel
                              </Badge>
                            )}

                            {schema.type === "reference" && schema.label && (
                              <Badge variant="outline" className="h-5">
                                {schema.label}
                              </Badge>
                            )}

                            {Boolean(schema?.default?.toString()) && (
                              <Badge variant="outline" className="h-5">
                                Varsayılan: {schema?.default.toString()}
                              </Badge>
                            )}

                            {schema?.regex && (
                              <Badge variant="outline" className="h-5">
                                Pattern: {schema?.regex}
                              </Badge>
                            )}
                            {schema?.min !== undefined && (
                              <Badge variant="outline" className="h-5">
                                Min: {schema?.min}
                              </Badge>
                            )}
                            {schema?.max !== undefined && (
                              <Badge variant="outline" className="h-5">
                                Max: {schema?.max}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-primary"
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    className="!bg-primary"
                  />
                </CardContent>
              )}
            </div>
          </Card>
        </Resizable>
        {selected && <SchemaNodeMenu />}
      </div>
    );
  }
);
