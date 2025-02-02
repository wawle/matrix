export const dynamicInput = {
  template: (name: string, props: any): string => {
    const { model, field } = props;
    return `

import React from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { ReferenceInput } from "@/components/ui/reference-input";
import { NumberInput } from "@/components/ui/number-input";
interface DynamicInputProps {
  label?: string;
  options?: { label: string; value: string }[];
}

const DynamicInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & DynamicInputProps
>(({ className, type, label = "", options = [], ...props }, ref) => {
  switch (type) {
    case "reference":
      return (
        <ReferenceInput
          className={className}
          ref={ref}
          options={options}
          label={label}
          {...props}
        />
      );
    case "date":
      return <DateInput className={className} ref={ref} {...props} />;
    case "number":
      return <NumberInput className={className} ref={ref} {...props} />;
    default:
      return <Input className={className} ref={ref} {...props} />;
  }
});

DynamicInput.displayName = "DynamicInput";

export { DynamicInput };

    `;
  },
};
