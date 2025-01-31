import { ChatEdit } from './components/ChatEdit';

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
      <ChatEdit chatId={params.chatId} />

    </div>
  )
}
    