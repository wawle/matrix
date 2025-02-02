import React from "react";
import { Input } from "./input";
import { DateInput } from "./date-input";
import { ReferenceInput } from "./reference-input";

interface DynamicInputProps {
  options?: { label: string; value: string }[];
}

const DynamicInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & DynamicInputProps
>(({ className, type, options = [], ...props }, ref) => {
  switch (type) {
    case "reference":
      return (
        <ReferenceInput
          className={className}
          ref={ref}
          options={options}
          {...props}
        />
      );
    case "date":
      return <DateInput className={className} ref={ref} {...props} />;
    default:
      return <Input className={className} ref={ref} {...props} />;
  }
});

DynamicInput.displayName = "DynamicInput";

export { DynamicInput };
