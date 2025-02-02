export const page = {
  template: (name: string, props: Record<string, any>): string => {
    const { children = "" } = props;
    return `
interface Props {
 searchParams: Promise<{
    [key: string]: any;
  }>;
  params: Promise<{
    [key: string]: any;
  }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return (
    <div>
      ${children}
    </div>
  )
}
    `;
  },
};
