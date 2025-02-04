import {
  BadgePlus,
  BookUser,
  Bot,
  BotIcon,
  Box,
  BoxIcon,
  CircleDotDashed,
  FileBox,
  FileInput,
  FileStack,
  FolderRoot,
  Home,
  HomeIcon,
  KeyRound,
  LayoutDashboard,
  LogIn,
  MessageCircleMore,
  MessageSquare,
  Route,
  Settings2,
  Unplug,
  UserRoundPen,
  Users,
  Workflow,
} from "lucide-react";
import { IAgent } from "../models/agent";

export interface INavItem {
  title: string;
  url: string;
  icon: React.JSX.Element;
  isActive?: boolean;
  items?: INavItem[];
  hasMore?: boolean;
}

export interface ISidebarData {
  navMain: INavItem[];
  navPrimary: INavItem[];
  navSecondary: INavItem[];
}

export const adminSidebarData: ISidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard />,
    },
  ],
  navPrimary: [
    {
      title: "Auth",
      url: "/admin/users",
      icon: <MessageSquare />,
      isActive: false,
      items: [
        {
          title: "Users",
          url: "/admin/users",
          icon: <Users />,
          isActive: false,
        },
      ],
    },

    {
      title: "Agents",
      url: "/admin/agents",
      icon: <BotIcon />,
      isActive: false,
      items: [
        {
          title: "Agents",
          url: "/admin/agents",
          icon: <BotIcon />,
          isActive: false,
        },
        {
          title: "Sessions",
          url: "/admin/sessions",
          icon: <LogIn />,
          isActive: false,
        },
        {
          title: "Chats",
          url: "/admin/chats",
          icon: <MessageCircleMore />,
          isActive: false,
        },
        {
          title: "Hirings",
          url: "/admin/hirings",
          icon: <UserRoundPen />,
          isActive: false,
        },

        {
          title: "Familys",
          url: "/admin/familys",
          icon: <BookUser />,
          isActive: false,
        },
        {
          title: "Keys",
          url: "/admin/keys",
          icon: <KeyRound />,
          isActive: false,
        },
      ],
    },
    {
      title: "Flowish",
      url: "/admin/flowish",
      icon: <Workflow />,
      isActive: false,
      items: [
        {
          title: "Flows",
          url: "/admin/flows",
          icon: <Workflow />,
          isActive: false,
        },
        {
          title: "FlowSteps",
          url: "/admin/flowsteps",
          icon: <Route />,
          isActive: false,
        },
        {
          title: "FlowSessions",
          url: "/admin/flowsessions",
          icon: <LogIn />,
          isActive: false,
        },
      ],
    },
    {
      title: "XGO",
      url: "/admin/projects",
      icon: <MessageSquare />,
      isActive: false,
      items: [
        {
          title: "Projects",
          url: "/admin/projects",
          icon: <FolderRoot />,
          isActive: false,
        },
        {
          title: "Versions",
          url: "/admin/versions",
          icon: <FileStack />,
          isActive: false,
        },
        {
          title: "Models",
          url: "/admin/models",
          icon: <FileBox />,
          isActive: false,
        },
        {
          title: "Fields",
          url: "/admin/fields",
          icon: <FileInput />,
          isActive: false,
        },
        {
          title: "Nodes",
          url: "/admin/nodes",
          icon: <CircleDotDashed />,
          isActive: false,
        },
        {
          title: "Edges",
          url: "/admin/edges",
          icon: <Unplug />,
          isActive: false,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2 />,
      isActive: false,
    },
  ],
};

export const userSidebarData = {
  navMain: [],
  navPrimary: [
    {
      title: "Discover",
      url: "/discover",
      icon: <Home />,
      items: [
        {
          title: "Agents",
          url: "/agents",
          icon: <Bot />,
        },
        {
          title: "Flowish",
          url: "/flowish/flows",
          icon: <Workflow />,
        },
        {
          title: "XGO",
          url: "/xgo/projects",
          icon: <Box />,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2 />,
      isActive: false,
    },
  ],
};

export const agents: IAgent[] = [
  {
    name: "Agent 1",
    title: "Agent 1",
    instructions: "Agent 1",
    photo:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    model_provider: "openai",
    model_name: "gpt-4o",
    max_tokens: 1000,
    temperature: 0.5,
    seed: 1,
    stream: true,
    is_public: true,
    key: {
      name: "Agent 1",
      description: "Agent 1",
      value: "1",
      type: "api_key",
      id: "key-1",
      _id: "key-1",
      user: {
        id: "1",
        _id: "1",
        fullname: "Agent 1",
        email: "agent1@example.com",
        password: "password",
        photo:
          "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
        role: "user",
      },
    },
    id: "1",
    _id: "1",
  },
  {
    name: "Agent 2",
    title: "Agent 2",
    instructions: "Agent 2",
    photo:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    model_provider: "openai",
    model_name: "gpt-4o",
    max_tokens: 1000,
    temperature: 0.5,
    seed: 1,
    stream: true,
    is_public: true,
    key: {
      name: "Agent 2",
      description: "Agent 2",
      value: "2",
      type: "api_key",
      id: "key-2",
      _id: "key-2",
      user: {
        id: "2",
        _id: "2",
        fullname: "Agent 2",
        email: "agent2@example.com",
        password: "password",
        photo:
          "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
        role: "user",
      },
    },
    id: "2",
    _id: "2",
  },
  {
    name: "Agent 3",
    title: "Agent 3",
    instructions: "Agent 3",
    photo:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    model_provider: "openai",
    model_name: "gpt-4o",
    max_tokens: 1000,
    temperature: 0.5,
    seed: 1,
    stream: true,
    is_public: true,
    key: {
      name: "Agent 3",
      description: "Agent 3",
      value: "3",
      type: "api_key",
      id: "key-3",
      _id: "key-3",
      user: {
        id: "3",
        _id: "3",
        fullname: "Agent 3",
        email: "agent3@example.com",
        password: "password",
        photo:
          "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
        role: "user",
      },
    },
    id: "3",
    _id: "3",
  },
];
