export const button = {
  template: (name: string, props: Record<string, any>) => {
    const className = props?.className || "";
    const variant = props?.variant || "default";
    const size = props?.size || "default";
    const onClick = props?.onClick;
    const children = props.children;

    return `
"use client";
import { Button } from "@/components/ui/button"
        
export function ${name}() {
    return (
      <Button variant="${variant}" size="${size}" className="${className}" onClick={${onClick}}>
        ${children}
      </Button>
    )
}
`;
  },
};
