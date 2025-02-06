import mongoose from "mongoose";
import { IKey, Key } from "./key";
import { Hiring } from "./hiring";
import { FlowStep } from "./flowstep";
import { Family } from "./family";
import { ISession, Session } from "./session";
import OpenAI from "openai";
import { Chat, IChat } from "./chat";
import { ErrorResponse } from "../middlewares/error";

export interface IAgent {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  instructions: string;
  stream: boolean;
  model_provider: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  seed: number;
  name: string;
  title: string;
  is_public: boolean;
  photo: string;
  key: IKey;

  getKey(): Promise<string>;
  getOpenAI(): Promise<OpenAI>;
  getSession(sessionId: string): Promise<ISession | null>;
  protect(userId: string): Promise<boolean>;
  getOrCreateSession(userId: string, sessionId: string): Promise<ISession>;
  getHistory(
    sessionId: string
  ): Promise<{ role: "user" | "system"; content: string }[]>;
  createChat(
    sessionId: string,
    role: "user" | "system",
    message: string,
    attachments: File[]
  ): Promise<IChat>;
  sendMessage(
    sessionId: string,
    message: string,
    attachments: File[],
    onStream?: (chunk: string) => void
  ): Promise<string>;
  execute(
    userId: string,
    sessionId: string,
    message: string,
    attachments: File[],
    onStream?: (chunk: string) => void
  ): Promise<string>;
}

export type AgentModel = mongoose.Model<IAgent>;

export const agentSchema = new mongoose.Schema<IAgent>(
  {
    instructions: {
      type: String,
      required: true,
    },
    stream: {
      type: Boolean,
      required: false,
    },
    model_provider: {
      type: String,
      required: true,
    },
    model_name: {
      type: String,
      required: true,
    },
    max_tokens: {
      type: Number,
      required: false,
    },
    temperature: {
      type: Number,
      required: false,
    },
    seed: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    is_public: {
      type: Boolean,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    key: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Key",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

agentSchema.methods.getKey = async function (): Promise<string> {
  const agent = this as IAgent;
  const key = await Key.findById(agent.key);
  if (!key) {
    throw new ErrorResponse("Key not found", 404);
  }
  return key.value;
};

agentSchema.methods.getOpenAI = async function (): Promise<OpenAI> {
  const agent = this as IAgent;
  const apiKey = await agent.getKey();
  return new OpenAI({
    apiKey,
  });
};

agentSchema.methods.getSession = async function (
  sessionId: string
): Promise<ISession | null> {
  const session: ISession | null = await Session.findById(sessionId);
  if (!session) {
    throw new ErrorResponse("Session not found", 404);
  }
  return session;
};

agentSchema.methods.getHistory = async function (
  sessionId: string
): Promise<{ role: "user" | "system"; content: string }[]> {
  const agent = this as IAgent;
  const session: ISession | null = await agent.getSession(sessionId);
  if (!session) {
    throw new ErrorResponse("Session not found", 404);
  }
  return session.chats.map((chat) => ({
    role: chat.role,
    content: chat.content,
  }));
};

agentSchema.methods.getOrCreateSession = async function (
  userId: string,
  sessionId: string
): Promise<ISession | null> {
  const agent = this as IAgent;
  let session = await agent.getSession(sessionId);
  if (!session) {
    session = await Session.create({
      agent: agent._id,
      user: userId,
    });
  }

  if (!session) {
    throw new ErrorResponse("Session creation failed", 400);
  }

  return session;
};

agentSchema.methods.createChat = async function (
  sessionId: string,
  role: "user" | "system",
  content: string,
  attachments: File[]
): Promise<IChat> {
  const chat = await Chat.create({
    role,
    content,
    attachments,
    session: sessionId,
  });
  return chat;
};

agentSchema.methods.sendMessage = async function (
  sessionId: string,
  message: string,
  attachments: File[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const agent = this as IAgent;
  const openai = await agent.getOpenAI();
  const history = await agent.getHistory(sessionId);

  const stream = await openai.chat.completions.create({
    model: agent.model_name,
    stream: true,
    max_tokens: agent.max_tokens,
    temperature: agent.temperature,
    seed: agent.seed,
    messages: [
      { role: "system", content: agent.instructions },
      ...history,
      { role: "user", content: message },
    ],
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      fullResponse += content;
      if (onStream) {
        onStream(content);
      }
    }
  }

  if (!fullResponse) {
    throw new ErrorResponse("Agent response is empty", 400);
  }

  return fullResponse;
};

agentSchema.methods.protect = async function (
  userId: string
): Promise<boolean> {
  const agent = this as IAgent;
  const contract = await Hiring.exists({
    agent: agent._id,
    user: userId,
  });

  if (!contract) {
    throw new ErrorResponse("You are not authorized to use this agent", 403);
  }

  return true;
};

agentSchema.methods.execute = async function (
  userId: string,
  sessionId: string,
  message: string,
  attachments: File[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const agent = this as IAgent;
  await agent.protect(userId);
  const session = await agent.getOrCreateSession(userId, sessionId);
  await agent.createChat(session._id, "user", message, attachments);
  const response = await agent.sendMessage(
    session._id,
    message,
    attachments,
    onStream
  );
  await agent.createChat(session._id, "system", response, []);
  return response;
};

agentSchema.virtual("contracts", {
  ref: Hiring,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("flowsteps", {
  ref: FlowStep,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("parents", {
  ref: Family,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("sessions", {
  ref: Session,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    FlowStep.deleteMany({ agent: _id }),
    Hiring.deleteMany({ agent: _id }),
    Family.deleteMany({ agent: _id }),
    Family.deleteMany({ parent: _id }),
    Session.deleteMany({ agent: _id }),
  ]);
  next();
});

// Model tanımını güncelle
export const Agent =
  (mongoose.models.Agent as AgentModel) ||
  mongoose.model<IAgent, AgentModel>("Agent", agentSchema);
