import { ThemeLayout } from "./components/ThemeLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <ThemeLayout>{children}</ThemeLayout>
    </section>
  );
}
