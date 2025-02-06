import { IVersion } from "@/lib/models/version";

// CRM Şablonu
export const crmModel: IVersion = {
  id: "crm",
  name: "CRM",
  description: "Müşteri ilişkileri yönetimi için temel veritabanı şemaları",
  is_active: false,
  type: "model",
  nodes: [
    {
      id: "User",
      position: { x: 100, y: 100 },
      data: {
        name: "User",
        description: "Müşteri ve potansiyel müşteri bilgilerini içeren şema",
        fields: [
          {
            id: "c1",
            name: "fullname",
            type: "string",
            label: "Full Name",
            validations: { required: true },
          },
          {
            id: "c2",
            name: "email",
            type: "string",
            label: "Email",
            validations: { required: true },
          },
          {
            id: "c4",
            name: "role",
            type: "string",
            label: "Role",
            validations: { required: true },
          },
          {
            id: "c5",
            name: "password",
            type: "string",
            label: "Password",
            validations: { required: true },
          },
        ],
      },
    },
    {
      id: "Customer",
      position: { x: 500, y: 100 },
      data: {
        name: "Customer",
        description: "Customer bilgilerini içeren şema",
        fields: [
          {
            id: "co2",
            name: "fullname",
            type: "string",
            label: "Full Name",
            validations: { required: true },
          },
          {
            id: "co3",
            name: "email",
            type: "string",
            label: "Email",
            validations: { required: true },
          },
          {
            id: "co4",
            name: "phone",
            type: "string",
            label: "Phone",
            validations: { required: false },
          },
          {
            id: "co5",
            name: "address",
            type: "object",
            label: "Address",
            validations: { required: false },
          },
          {
            id: "co6",
            name: "user",
            type: "reference",
            label: "User",
            validations: { required: true },
          },
        ],
      },
    },
    {
      id: "Activity",
      position: { x: 100, y: 400 },
      data: {
        name: "Activity",
        description: "Activity bilgilerini içeren şema",
        fields: [
          {
            id: "o2",
            name: "title",
            type: "string",
            label: "Title",
            validations: { required: true },
          },
          {
            id: "o3",
            name: "user",
            type: "reference",
            label: "User",
            validations: { required: true },
          },
          {
            id: "o4",
            name: "customer",
            type: "reference",
            label: "Customer",
            validations: { required: true },
          },
          {
            id: "o5",
            name: "status",
            type: "string",
            label: "Status",
            validations: { required: true },
          },
          {
            id: "o6",
            name: "description",
            type: "string",
            label: "Description",
            validations: { required: false },
          },
          {
            id: "o7",
            name: "date",
            type: "date",
            label: "Date",
            validations: { required: true },
          },
          {
            id: "o8",
            name: "type",
            type: "string",
            label: "Type",
            validations: { required: true },
          },
          {
            id: "o9",
            name: "priority",
            type: "string",
            label: "Priority",
            validations: { required: true },
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
      data: { relationType: "oneToMany" },
    },
    {
      id: "e2",
      source: "Activity",
      target: "User",

      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e3",
      source: "Activity",
      target: "Customer",

      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
  ],
};
