
"use client";

import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";

interface Props {
  defaultValues: any;
  inputs: {
    name: string;
    label: string;
    type: string;
  }[];
  submitText?: string;
  onSubmit: (data: any) => Promise<{
    error?: any;
    success?: any;
    data?: any;
  }>;
}


export function FormUI(props: Props) {
  const { defaultValues, inputs, submitText = "Kaydet", onSubmit } = props;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    defaultValues,
  });

  async function handleSubmit(data: any) {
    setIsLoading(true);
    await onSubmit(data).then((response) => {
      toast[response?.success ? "success" : "error"](
        response?.success ? "Success" : response?.error,
        {
          description: (
            <pre className="w-[300px] rounded-md bg-slate-950 p-2">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        }
      );
    });
    setIsLoading(false);
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {inputs.map((input) => (
          <FormField
            key={input.name}
            control={form.control}
            name={input.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={input.name}>{input.label}</FormLabel>
                <FormControl>
                  <Input
                    id={input.name}
                    type={input.type}
                    placeholder={input.label}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
    
    