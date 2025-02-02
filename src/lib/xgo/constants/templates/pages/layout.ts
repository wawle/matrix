export const layout = {
  template: (name: string, props: Record<string, any>): string => {
    const { children = "{children}" } = props;
    return `
        export default function Layout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <section>
              ${children}
            </section>
          )
        }`;
  },
};
