import { IVersion } from "@/lib/models/version";

// E-Ticaret Şablonu
export const eCommerceModel: IVersion = {
  id: "e-commerce",
  name: "E-Ticaret",
  description: "E-ticaret sistemi için temel veritabanı şemaları",
  is_active: true,
  type: "model",
  nodes: [
    {
      id: "product",
      position: { x: 100, y: 100 },
      type: "model",
      data: {
        name: "Product",
        description: "Ürün bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "p1", name: "id", type: "string", required: true },
          { id: "p2", name: "ad", type: "string", required: true },
          { id: "p3", name: "açıklama", type: "string", required: false },
          { id: "p4", name: "fiyat", type: "number", required: true },
          { id: "p5", name: "stok", type: "number", required: true },
          { id: "p6", name: "kategori", type: "reference", required: true },
          { id: "p7", name: "resimler", type: "array", required: false },
        ],
      },
    },
    {
      id: "category",
      position: { x: 500, y: 100 },
      type: "model",
      data: {
        name: "Category",
        description: "Ürün kategorilerini içeren şema",
        isActive: true,
        fields: [
          { id: "c1", name: "id", type: "string", required: true },
          { id: "c2", name: "ad", type: "string", required: true },
          { id: "c3", name: "açıklama", type: "string", required: false },
          {
            id: "c4",
            name: "üstKategori",
            type: "reference",
            required: false,
          },
        ],
      },
    },
    {
      id: "customer",
      position: { x: 100, y: 400 },
      type: "model",
      data: {
        name: "Customer",
        description: "Müşteri bilgilerini içeren şema",
        isActive: true,
        fields: [
          {
            id: "u3",
            name: "fullname",
            type: "string",
            label: "Full Name",
            validations: { required: true },
          },
          {
            id: "u4",
            name: "email",
            type: "string",
            label: "Email",
            validations: { required: true },
          },
          {
            id: "u5",
            name: "phone",
            type: "string",
            label: "Phone",
            validations: { required: false },
          },
        ],
      },
    },
    {
      id: "order",
      position: { x: 500, y: 400 },
      type: "model",
      data: {
        name: "Order",
        description: "Sipariş bilgilerini içeren şema",
        isActive: true,
        fields: [
          {
            id: "o2",
            name: "customer",
            type: "reference",
            label: "Customer",
            validations: { required: true },
          },
          {
            id: "o3",
            name: "products",
            type: "array",
            label: "Products",
            validations: { required: true },
          },
          {
            id: "o4",
            name: "total",
            type: "number",
            label: "Total",
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
            name: "date",
            type: "date",
            label: "Date",
            validations: { required: true },
          },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "product",
      target: "category",

      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e2",
      source: "order",
      target: "customer",

      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e3",
      source: "order",
      target: "product",

      animated: true,
      label: "N:N",
      data: { relationType: "manyToMany" },
    },
  ],
};
