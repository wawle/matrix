"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createVersionAction,
  updateVersionAction,
} from "@/lib/actions/version";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Proje adı en az 3 karakter olmalıdır.",
  }),
  description: z.string().optional(),
  type: z.enum(["model", "agent", "page", "screen"]),
  is_active: z.boolean(),
  project: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface VersionFormProps {
  defaultValues: FormValues;
  versionId?: string;
}

export function VersionForm({ defaultValues, versionId }: VersionFormProps) {
  const router = useRouter();
  const { projectId } = useParams();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    const action =
      versionId !== "new"
        ? updateVersionAction(versionId as string, data)
        : createVersionAction(data);
    const successMessage = versionId
      ? "Version başarıyla güncellendi."
      : "Version başarıyla oluşturuldu.";
    const errorMessage = versionId
      ? "Version güncellenirken bir hata oluştu."
      : "Version oluşturulurken bir hata oluştu.";

    try {
      const result = await action;

      if (result.success) {
        toast.success(successMessage);
        router.push(`/xgo/projects/${projectId}/versions/${result.data?._id}`);
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
              <FormLabel>Version Adı</FormLabel>
              <FormControl>
                <Input placeholder="Yeni Version" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model">Model</SelectItem>
                    <SelectItem value="flow">Flow</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="screen">Screen</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Active</FormLabel>
              <div className="flex items-center justify-between border rounded-md p-2 px-3">
                <FormDescription>
                  Versioninizin aktif olup olmadığını belirleyin.
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
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
                  placeholder="Versioniniz hakkında kısa bir açıklama yazın..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {versionId ? "Version Güncelle" : "Version Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
