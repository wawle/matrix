import React from "react";
import Client from "./components/client";
import { fetchSession, fetchSessions } from "@/lib/actions/session";

interface Props {
  searchParams: Promise<{
    [key: string]: any;
  }>;
  params: Promise<{
    [key: string]: any;
  }>;
}

const SessionDetailPage = async (props: Props) => {
  const { agentId, sessionId } = await props.params;
  const { data: session } = await fetchSession(sessionId);
  const { data: sessions } = await fetchSessions();
  const defaultMessages = session
    ? session.chats.map((chat) => ({
        id: chat.id,
        role: chat.role,
        content: chat.content,
        timestamp: chat.createdAt as Date,
        attachments: [],
      }))
    : [];

  return (
    <Client
      agentId={agentId}
      sessionId={sessionId}
      defaultMessages={defaultMessages}
      sessions={sessions}
    />
  );
};

export default SessionDetailPage;
