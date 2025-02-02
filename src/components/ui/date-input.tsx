"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

const DateInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, value, onChange }, ref) => {
  const dateValue =
    value && typeof value === "string" ? new Date(value) : new Date();
  const onSelect = (date: Date | undefined) => {
    onChange?.(date as any);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? format(dateValue, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={onSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

DateInput.displayName = "DateInput";

export { DateInput };
