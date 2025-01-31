import { FlowSessionEdit } from './components/FlowSessionEdit';

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
      <FlowSessionEdit flowsessionId={params.flowsessionId} />

    </div>
  )
}
    