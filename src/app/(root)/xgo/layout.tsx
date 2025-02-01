import Header from "@/components/sidebar/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header plain />
      {children}
    </section>
  );
}
