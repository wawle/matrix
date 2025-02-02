export const referenceInput = {
  template: (name: string, props: any): string => {
    return `
"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";

interface ReferenceInputProps {
  label: string;
  options: { label: string; value: string }[];
}

const ReferenceInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & ReferenceInputProps
>(({ className, value, label, placeholder, options, onChange }, ref) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options?.find((option) => option.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{label} bulunamadı.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    const event = {
                      target: {
                        value: option.value,
                      },
                    };
                    onChange?.(event as any);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

ReferenceInput.displayName = "ReferenceInput";

export { ReferenceInput };

    `;
  },
};
