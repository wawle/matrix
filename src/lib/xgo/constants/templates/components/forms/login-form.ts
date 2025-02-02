export const loginForm = {
  template: (name: string, props: Record<string, any>): string => {
    const { projectName } = props;
    return `
import { FormUI } from "@/components/ui/form-ui";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { LoginFormValues } from "@/lib/schemas/auth";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

export async function LoginForm() {
  const defaultValues = {
    email: "",
    password: "",
  };

  const inputs = [
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

  const onSubmit = async (data: LoginFormValues) => {
    "use server";

    const response = await loginAction(data);

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
          ${projectName}
        </div>
        <Container title="Giriş" description="${projectName} giriş yapın">
          <FormUI
            defaultValues={defaultValues}
            inputs={inputs}
            onSubmit={onSubmit}
            submitText="Giriş Yap"
          />
          <div className="text-center text-sm mt-10">
            Hesabın yok mu?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Kayıt Ol
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
      `;
  },
};
