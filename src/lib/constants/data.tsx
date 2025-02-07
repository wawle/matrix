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
import { Message } from "@/components/ui/chat";

export interface INavItem {
  title: string;
  url: string;
  icon: any;
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
  navMain: [
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
          title: "XGO",
          url: "/xgo",
          icon: <Box />,
        },
      ],
    },
  ],
  navPrimary: [],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2 />,
      isActive: false,
    },
  ],
};

export const defaultMessages: Message[] = [
  {
    id: "1",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "Merhaba, neler yapabilirsiniz?",
    role: "user" as const,
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "4",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "5",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "6",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "7",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "8",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "9",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "10",
    content: "Merhaba, neler yapabilirsiniz?",
    role: "user" as const,
    timestamp: new Date(),
  },
  {
    id: "11",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "12",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "13",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "14",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "15",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
  {
    id: "16",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "system" as const,
    timestamp: new Date(),
  },
];
