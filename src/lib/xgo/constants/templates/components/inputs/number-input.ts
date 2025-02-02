export const numberInput = {
  template: (name: string, props: any): string => {
    return `
import React from "react";
import { Input } from "@/components/ui/input";

const NumberInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // check if value first char is 0 then remove it
    let newValue: string | number = value;
    if (value[0] === "0") {
      newValue = value.slice(1);
    } else {
      newValue = Number(e.target.value.replace(/,/g, "."));
    }

    const newEvent: any = {
      ...e,
      target: {
        ...e.target,
        value: newValue,
      },
    };
    props.onChange?.(newEvent);
  };

  return (
    <Input
      className={className}
      ref={ref}
      {...props}
      type="number"
      inputMode="numeric"
      onChange={onChange}
    />
  );
});

NumberInput.displayName = "NumberInput";

export { NumberInput };

    `;
  },
};
