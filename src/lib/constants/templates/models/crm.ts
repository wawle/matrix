import { IVersion, VersionType } from "@/lib/models/version";

// CRM Şablonu
export const crmModel: IVersion<VersionType.MODEL> = {
  id: "crm",
  name: "CRM",
  description: "Müşteri ilişkileri yönetimi için temel veritabanı şemaları",
  is_active: false,
  type: VersionType.MODEL,
  nodes: [
    {
      id: "User",
      position: { x: 100, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "User",
        description: "Müşteri ve potansiyel müşteri bilgilerini içeren şema",
        schemas: [
          {
            id: "c1",
            name: "fullname",
            type: "string",
            label: "Full Name",
            required: true,
          },
          {
            id: "c2",
            name: "email",
            type: "string",
            label: "Email",
            required: true,
            unique: true,
            match: "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/",
          },
          {
            id: "c4",
            name: "role",
            type: "string",
            label: "Role",
            required: true,
            default: "user",
          },
          {
            id: "c5",
            name: "password",
            type: "string",
            label: "Password",
            required: true,
          },
        ],
      },
    },
    {
      id: "Customer",
      position: { x: 500, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "Customer",
        description: "Customer bilgilerini içeren şema",
        schemas: [
          {
            id: "co2",
            name: "fullname",
            type: "string",
            label: "Full Name",
            required: true,
          },
          {
            id: "co3",
            name: "email",
            type: "string",
            label: "Email",
            required: true,
            unique: true,
            match: "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/",
          },
          {
            id: "co4",
            name: "phone",
            type: "string",
            label: "Phone",
            required: false,
          },
          {
            id: "co5",
            name: "user",
            type: "reference",
            label: "User",
            required: true,
            config: {
              optionLabel: "fullname",
            },
          },
        ],
      },
    },
    {
      id: "Activity",
      position: { x: 100, y: 400 },
      type: VersionType.MODEL,
      data: {
        name: "Activity",
        description: "Activity bilgilerini içeren şema",
        schemas: [
          {
            id: "o2",
            name: "title",
            type: "string",
            label: "Title",
            required: true,
          },
          {
            id: "o3",
            name: "user",
            type: "reference",
            label: "User",
            required: true,
            config: {
              optionLabel: "fullname",
            },
          },
          {
            id: "o4",
            name: "customer",
            type: "reference",
            label: "Customer",
            required: true,
            config: {
              optionLabel: "fullname",
            },
          },
          {
            id: "o5",
            name: "status",
            type: "string",
            label: "Status",
            required: true,
          },
          {
            id: "o6",
            name: "description",
            type: "string",
            label: "Description",
            required: false,
          },
          {
            id: "o7",
            name: "date",
            type: "date",
            label: "Date",
            required: true,
          },
          {
            id: "o8",
            name: "type",
            type: "string",
            label: "Type",
            required: true,
          },
          {
            id: "o9",
            name: "priority",
            type: "string",
            label: "Priority",
            required: true,
          },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "Customer",
      target: "User",
      animated: true,
      label: "N:1",
      type: VersionType.MODEL,
      data: {
        type: "oneToMany",
      },
    },
    {
      id: "e2",
      source: "Activity",
      target: "User",
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: {
        type: "oneToMany",
      },
    },
    {
      id: "e3",
      source: "Activity",
      target: "Customer",
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: {
        type: "oneToMany",
      },
    },
  ],
};
