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
import {
  createProjectAction,
  updateProjectAction,
} from "@/lib/actions/project";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Proje adı en az 3 karakter olmalıdır.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  defaultValues: FormValues;
  projectId?: string;
}

export function ProjectForm({ defaultValues, projectId }: ProjectFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    const action = projectId
      ? updateProjectAction(projectId as string, data)
      : createProjectAction(data);
    const successMessage = projectId
      ? "Projeniz başarıyla güncellendi."
      : "Projeniz başarıyla oluşturuldu.";
    const errorMessage = projectId
      ? "Projeniz güncellenirken bir hata oluştu."
      : "Projeniz oluşturulurken bir hata oluştu.";

    try {
      const result = await action;

      if (result.success) {
        toast.success(successMessage);
        router.push(`/xgo/projects/${result.data?._id}`);
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
              <FormLabel>Proje Adı</FormLabel>
              <FormControl>
                <Input placeholder="Yeni Proje" {...field} />
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
                  placeholder="Projeniz hakkında kısa bir açıklama yazın..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {projectId ? "Proje Güncelle" : "Proje Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
