import { ModelEdit } from './components/ModelEdit';

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
      <ModelEdit modelId={params.modelId} />

    </div>
  )
}
    