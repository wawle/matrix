
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { registerAction } from "@/lib/actions/auth";
import { RegisterFormValues } from "@/lib/schemas/auth";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

export async function RegisterForm() {
  const defaultValues = {
    email: "",
    password: "",
    fullname: "",
  };

  const inputs = [
    {
      name: "fullname",
      label: "Ad Soyad",
      type: "text",
    },
    {
      name: "email",
      label: "E-posta",
      type: "email",
    },
    {
      name: "password",
      label: "Şifre",
      type: "password",
    },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    "use server";

    const response = await registerAction(data);

    if (response.error) {
      return { error: response.error };
    }

    if (response.user?.role === "admin") {
      redirect("/admin");
    }

    redirect("/");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          matrix
        </div>
        <Container title="Kayıt" description="matrix kayıt olun">
          <FormUI
            defaultValues={defaultValues}
            inputs={inputs}
            onSubmit={onSubmit}
            submitText="Kayıt Ol"
          />
          <div className="text-center text-sm mt-10">
            Hesabın var mı?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Giriş Yap
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}

    