"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createFlowAction, updateFlowAction } from "@/lib/actions/flow";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Proje adı en az 3 karakter olmalıdır.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FlowFormProps {
  defaultValues: FormValues;
  flowId?: string;
}

export function FlowForm({ defaultValues, flowId }: FlowFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    const action =
      flowId !== "new"
        ? updateFlowAction(flowId as string, data)
        : createFlowAction(data);
    const successMessage = flowId
      ? "Flow başarıyla güncellendi."
      : "Flow başarıyla oluşturuldu.";
    const errorMessage = flowId
      ? "Flow güncellenirken bir hata oluştu."
      : "Flow oluşturulurken bir hata oluştu.";

    try {
      const result = await action;

      if (result.success) {
        toast.success(successMessage);
        router.push(`/flowish/flows/${result.data?._id}`);
      } else {
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flow Adı</FormLabel>
              <FormControl>
                <Input placeholder="Yeni Flow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Flowiniz hakkında kısa bir açıklama yazın..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {flowId ? "Flow Güncelle" : "Flow Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
