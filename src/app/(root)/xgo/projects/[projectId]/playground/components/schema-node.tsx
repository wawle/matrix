"use client";

import React, { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Resizable } from "re-resizable";
import { IField } from "@/lib/models/field";
import { SchemaNodeMenu } from "./schema-node-menu";

interface SchemaNodeData {
  label: string;
  description?: string;
  isActive: boolean;
  fields: IField[];
  width?: number;
  height?: number;
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
}

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
  ({ data, selected }: NodeProps<SchemaNodeData>) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [width, setWidth] = useState(data.width || 300);
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
    }, [isExpanded, data.fields]);

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

      if (data.onWidthChange) {
        data.onWidthChange(newWidth);
      }
      if (data.onHeightChange) {
        data.onHeightChange(newHeight);
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
                    <CardTitle className="text-lg">{data.label}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.isActive && (
                      <Badge variant="outline" className="bg-primary/10">
                        Aktif
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {data.fields.map((field, index) => (
                      <React.Fragment key={field.id}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-base">
                              {field.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                fieldTypeBadgeVariants[field.type]?.variant ||
                                "default"
                              }
                            >
                              {fieldTypeBadgeVariants[field.type]?.label ||
                                field.type}
                            </Badge>

                            {field.validations?.required ? (
                              <Badge className="h-5">Zorunlu</Badge>
                            ) : (
                              <Badge variant="secondary" className="h-5">
                                Opsiyonel
                              </Badge>
                            )}

                            {field.type === "reference" && field.label && (
                              <Badge variant="outline" className="h-5">
                                {field.label}
                              </Badge>
                            )}

                            {Boolean(
                              field.validations?.default?.toString()
                            ) && (
                              <Badge variant="outline" className="h-5">
                                Varsayılan:{" "}
                                {field.validations?.default.toString()}
                              </Badge>
                            )}

                            {field.validations?.regex && (
                              <Badge variant="outline" className="h-5">
                                Pattern: {field.validations?.regex}
                              </Badge>
                            )}
                            {field.validations?.min !== undefined && (
                              <Badge variant="outline" className="h-5">
                                Min: {field.validations?.min}
                              </Badge>
                            )}
                            {field.validations?.max !== undefined && (
                              <Badge variant="outline" className="h-5">
                                Max: {field.validations?.max}
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
