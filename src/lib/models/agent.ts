import mongoose from "mongoose";
import { IKey, Key } from "./key";
import { Hiring } from "./hiring";
import { FlowStep } from "./flowstep";
import { Family } from "./family";
import { ISession, Session } from "./session";
import OpenAI from "openai";
import { Chat, IChat } from "./chat";

export interface IAgent {
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
}

// Model ve Document tiplerini tanımlayalım
export interface IAgentDocument extends IAgent, mongoose.Document {
  getKey(): Promise<string>;
  getOpenAI(): Promise<OpenAI>;
  getSession(sessionId: string): Promise<ISession | null>;
  getSessionMessages(sessionId: string): Promise<IChat[]>;
  getOrCreateSession(sessionId: string): Promise<ISession>;
  createChat(
    sessionId: string,
    sender: "user" | "system",
    message: string,
    attachments: File[]
  ): Promise<IChat>;
  sendMessage(
    session: ISession,
    message: string,
    attachments: File[]
  ): Promise<string>;
  execute(
    sessionId: string,
    message: string,
    attachments: File[]
  ): Promise<string>;
}

export type AgentModel = mongoose.Model<IAgentDocument>;

export const agentSchema = new mongoose.Schema<IAgentDocument>(
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
  const agent = this as IAgentDocument;
  const key = await Key.findById(agent.key);
  if (!key) {
    throw new Error("Key not found");
  }
  return key.value;
};

agentSchema.methods.getOpenAI = async function (): Promise<OpenAI> {
  const agent = this as IAgentDocument;
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
    throw new Error("Session not found");
  }
  return session;
};

agentSchema.methods.getSessionMessages = async function (
  sessionId: string
): Promise<IChat[]> {
  const agent = this as IAgentDocument;
  const session: ISession | null = await agent.getSession(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  return session.chats;
};

agentSchema.methods.getOrCreateSession = async function (
  sessionId: string
): Promise<ISession> {
  const agent = this as IAgentDocument;
  let session = await Session.findOne({
    agent: agent._id,
    sessionId,
  });
  if (!session) {
    session = await Session.create({
      agent: agent._id,
      sessionId,
    });
  }
  return session;
};

agentSchema.methods.createChat = async function (
  sessionId: string,
  sender: "user" | "system",
  message: string,
  attachments: File[]
): Promise<IChat> {
  const chat = await Chat.create({
    sender,
    message,
    attachments,
    session: sessionId,
  });
  return chat;
};

agentSchema.methods.sendMessage = async function (
  session: ISession,
  message: string,
  attachments: File[]
): Promise<string> {
  const agent = this as IAgentDocument;
  const openai = await agent.getOpenAI();
  const chats = await agent.getSessionMessages(session._id);
  const history = chats.map((chat) => ({
    role: chat.sender,
    content: chat.message,
  }));
  const response = await openai.chat.completions.create({
    model: agent.model_name,
    stream: agent.stream,
    max_tokens: agent.max_tokens,
    temperature: agent.temperature,
    seed: agent.seed,
    messages: [
      { role: "system", content: agent.instructions },
      ...history,
      { role: "user", content: message },
    ],
  });

  return response.choices[0].message.content;
};

agentSchema.methods.execute = async function (
  sessionId: string,
  message: string,
  attachments: File[]
): Promise<string> {
  const agent = this as IAgentDocument;
  const session = await agent.getOrCreateSession(sessionId);
  await agent.createChat(session._id, "user", message, attachments);
  const response = await agent.sendMessage(session, message, attachments);
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
  mongoose.model<IAgentDocument, AgentModel>("Agent", agentSchema);
