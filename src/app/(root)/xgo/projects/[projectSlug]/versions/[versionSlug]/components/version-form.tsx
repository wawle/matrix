"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
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
  createVersionAction,
  updateVersionAction,
} from "@/lib/actions/version";

import { VersionType } from "@/lib/models/version";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Proje adı en az 3 karakter olmalıdır.",
  }),
  description: z.string().optional(),
  type: z.enum([
    VersionType.MODEL,
    VersionType.AGENT,
    VersionType.PAGE,
    VersionType.SCREEN,
  ]),
  project: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface VersionFormProps {
  defaultValues: FormValues;
  versionId?: string;
}

export function VersionForm({ defaultValues, versionId }: VersionFormProps) {
  const router = useRouter();
  const { projectSlug, versionSlug } = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    const action = versionId
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
        router.push(
          `/xgo/projects/${projectSlug}/versions/${result.data?.slug}/playground`
        );
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

        <div className="flex items-center justify-between">
          <Button type="submit">
            {versionId ? "Version Güncelle" : "Version Oluştur"}
          </Button>
          <Link
            href={`/xgo/projects/${projectSlug}/versions/${versionSlug}/playground`}
          >
            <Button variant="link">Playground'a Git</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
