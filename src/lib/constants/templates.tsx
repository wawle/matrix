import { Node, Edge } from "reactflow";
import { IVersion } from "../models/version";

// Spor Salonu Şablonu
export const gymTemplate: IVersion = {
  id: "gym",
  name: "Spor Salonu Şemaları",
  description: "Spor salonu yönetimi için temel veritabanı şemaları",
  is_active: false,
  models: [
    {
      name: "Customer",
      fields: [
        {
          name: "fullname",
          type: "string",
          label: "Adı Soyadı",
        },

        {
          name: "email",
          type: "string",
          label: "Email",
        },
        {
          name: "phone",
          type: "string",
          label: "Telefon",
        },
      ],
    },
    {
      name: "Membership",
      fields: [
        {
          name: "customer",
          type: "reference",
          label: "Müşteri",
        },
        {
          name: "start_date",
          type: "date",
          label: "Başlangıç Tarihi",
        },
        {
          name: "end_date",
          type: "date",
          label: "Bitiş Tarihi",
        },
        {
          name: "membership_type",
          type: "reference",
          label: "Üyelik Tipi",
        },
        {
          name: "status",
          type: "string",
          label: "Durum",
        },
      ],
    },
    {
      name: "MembershipType",
      fields: [
        {
          name: "name",
          type: "string",
          label: "Adı",
        },
        {
          name: "duration",
          type: "number",
          label: "Süre",
        },
        {
          name: "price",
          type: "number",
          label: "Fiyat",
        },
        {
          name: "description",
          type: "string",
          label: "Açıklama",
        },
      ],
    },
    {
      name: "Trainer",
      fields: [
        {
          name: "fullname",
          type: "string",
          label: "Adı Soyadı",
        },
        {
          name: "email",
          type: "string",
          label: "Email",
        },
        {
          name: "phone",
          type: "string",
          label: "Telefon",
        },
        {
          name: "skills",
          type: "array",
          label: "Uzmanlıklar",
        },
        {
          name: "biography",
          type: "string",
          label: "Biyografi",
        },
      ],
    },
    {
      name: "Activity",
      fields: [
        {
          name: "name",
          type: "string",
          label: "Adı",
        },
        {
          name: "açıklama",
          type: "string",
          label: "Açıklama",
        },
        {
          name: "capacity",
          type: "number",
          label: "Kapasite",
        },
        {
          name: "level",
          type: "string",
          label: "Seviye",
        },
        {
          name: "duration",
          type: "number",
          label: "Süre",
        },
      ],
    },
    {
      name: "Schedule",
      fields: [
        {
          name: "activity",
          type: "reference",
          label: "Aktivite",
        },
        {
          name: "trainer",
          type: "reference",
          label: "Eğitmen",
        },
        {
          name: "start_date",
          type: "date",
          label: "Başlangıç Tarihi",
        },
        {
          name: "end_date",
          type: "date",
          label: "Bitiş Tarihi",
        },
        {
          name: "participants",
          type: "array",
          label: "Katılımcılar",
        },
        {
          name: "status",
          type: "string",
          label: "Durum",
        },
        {
          name: "notes",
          type: "string",
          label: "Notlar",
        },
      ],
    },
  ],
  nodes: [
    {
      id: "customer",
      type: "schema",
      position: { x: 100, y: 100 },
      data: {
        label: "Müşteri Şeması",
        description: "Müşteri bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "c1", name: "id", type: "string", required: true },
          { id: "c2", name: "ad", type: "string", required: true },
          { id: "c3", name: "soyad", type: "string", required: true },
          { id: "c4", name: "email", type: "string", required: true },
          { id: "c5", name: "telefon", type: "string", required: true },
          { id: "c6", name: "doğumTarihi", type: "date", required: true },
          { id: "c7", name: "cinsiyet", type: "string", required: true },
          { id: "c8", name: "acilDurum", type: "object", required: false },
          { id: "c9", name: "sağlıkDurumu", type: "string", required: false },
        ],
      },
    },
    {
      id: "membership",
      type: "schema",
      position: { x: 500, y: 100 },
      data: {
        label: "Üyelik Şeması",
        description: "Üyelik bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "m1", name: "id", type: "string", required: true },
          { id: "m2", name: "müşteri", type: "reference", required: true },
          { id: "m3", name: "başlangıçTarihi", type: "date", required: true },
          { id: "m4", name: "bitişTarihi", type: "date", required: true },
          { id: "m5", name: "üyelikTipi", type: "reference", required: true },
          { id: "m6", name: "durum", type: "string", required: true },
          { id: "m7", name: "ödeme", type: "object", required: true },
        ],
      },
    },
    {
      id: "membershipType",
      type: "schema",
      position: { x: 900, y: 100 },
      data: {
        label: "Üyelik Tipi Şeması",
        description: "Üyelik paketlerini içeren şema",
        isActive: true,
        fields: [
          { id: "mt1", name: "id", type: "string", required: true },
          { id: "mt2", name: "ad", type: "string", required: true },
          { id: "mt3", name: "süre", type: "number", required: true },
          { id: "mt4", name: "fiyat", type: "number", required: true },
          { id: "mt5", name: "açıklama", type: "string", required: false },
          { id: "mt6", name: "özellikler", type: "array", required: false },
        ],
      },
    },
    {
      id: "trainer",
      type: "schema",
      position: { x: 100, y: 400 },
      data: {
        label: "Eğitmen Şeması",
        description: "Eğitmen bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "t1", name: "id", type: "string", required: true },
          { id: "t2", name: "ad", type: "string", required: true },
          { id: "t3", name: "soyad", type: "string", required: true },
          { id: "t4", name: "email", type: "string", required: true },
          { id: "t5", name: "telefon", type: "string", required: true },
          { id: "t6", name: "uzmanlıklar", type: "array", required: true },
          {
            id: "t7",
            name: "çalışmaSaatleri",
            type: "object",
            required: true,
          },
          { id: "t8", name: "biyografi", type: "string", required: false },
        ],
      },
    },
    {
      id: "activity",
      type: "schema",
      position: { x: 500, y: 400 },
      data: {
        label: "Aktivite Şeması",
        description: "Grup dersleri ve aktiviteleri içeren şema",
        isActive: true,
        fields: [
          { id: "a1", name: "id", type: "string", required: true },
          { id: "a2", name: "ad", type: "string", required: true },
          { id: "a3", name: "açıklama", type: "string", required: true },
          { id: "a4", name: "kapasite", type: "number", required: true },
          { id: "a5", name: "seviye", type: "string", required: true },
          { id: "a6", name: "süre", type: "number", required: true },
        ],
      },
    },
    {
      id: "schedule",
      type: "schema",
      position: { x: 900, y: 400 },
      data: {
        label: "Program Şeması",
        description: "Ders ve aktivite programını içeren şema",
        isActive: true,
        fields: [
          { id: "s1", name: "id", type: "string", required: true },
          { id: "s2", name: "aktivite", type: "reference", required: true },
          { id: "s3", name: "eğitmen", type: "reference", required: true },
          { id: "s4", name: "başlangıç", type: "date", required: true },
          { id: "s5", name: "bitiş", type: "date", required: true },
          { id: "s6", name: "katılımcılar", type: "array", required: true },
          { id: "s7", name: "durum", type: "string", required: true },
          { id: "s8", name: "notlar", type: "string", required: false },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "membership",
      target: "customer",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e2",
      source: "membership",
      target: "membershipType",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e3",
      source: "schedule",
      target: "activity",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e4",
      source: "schedule",
      target: "trainer",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
  ],
};

// E-Ticaret Şablonu
const eCommerceTemplate: any = {
  id: "e-commerce",
  name: "E-Ticaret Şemaları",
  description: "E-ticaret sistemi için temel veritabanı şemaları",
  nodes: [
    {
      id: "product",
      type: "schema",
      position: { x: 100, y: 100 },
      data: {
        label: "Ürün Şeması",
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
          { id: "p8", name: "özellikler", type: "object", required: false },
        ],
      },
    },
    {
      id: "category",
      type: "schema",
      position: { x: 500, y: 100 },
      data: {
        label: "Kategori Şeması",
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
      type: "schema",
      position: { x: 100, y: 400 },
      data: {
        label: "Müşteri Şeması",
        description: "Müşteri bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "u1", name: "id", type: "string", required: true },
          { id: "u2", name: "ad", type: "string", required: true },
          { id: "u3", name: "soyad", type: "string", required: true },
          { id: "u4", name: "email", type: "string", required: true },
          { id: "u5", name: "telefon", type: "string", required: false },
          { id: "u6", name: "adres", type: "object", required: false },
        ],
      },
    },
    {
      id: "order",
      type: "schema",
      position: { x: 500, y: 400 },
      data: {
        label: "Sipariş Şeması",
        description: "Sipariş bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "o1", name: "id", type: "string", required: true },
          { id: "o2", name: "müşteri", type: "reference", required: true },
          { id: "o3", name: "ürünler", type: "array", required: true },
          { id: "o4", name: "tutar", type: "number", required: true },
          { id: "o5", name: "durum", type: "string", required: true },
          { id: "o6", name: "tarih", type: "date", required: true },
          { id: "o7", name: "adres", type: "object", required: true },
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

// CRM Şablonu
const crmTemplate: any = {
  id: "crm",
  name: "CRM Şemaları",
  description: "Müşteri ilişkileri yönetimi için temel veritabanı şemaları",
  nodes: [
    {
      id: "User",
      type: "schema",
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
      type: "schema",
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
      type: "schema",
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

// İK Şablonu
const hrmTemplate: any = {
  id: "hrm",
  name: "İK Şemaları",
  description: "İnsan kaynakları yönetimi için temel veritabanı şemaları",
  nodes: [
    {
      id: "employee",
      type: "schema",
      position: { x: 100, y: 100 },
      data: {
        label: "Çalışan Şeması",
        description: "Çalışan bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "e1", name: "id", type: "string", required: true },
          { id: "e2", name: "ad", type: "string", required: true },
          { id: "e3", name: "soyad", type: "string", required: true },
          { id: "e4", name: "email", type: "string", required: true },
          { id: "e5", name: "telefon", type: "string", required: false },
          { id: "e6", name: "departman", type: "reference", required: true },
          { id: "e7", name: "pozisyon", type: "reference", required: true },
          { id: "e8", name: "işeGiriş", type: "date", required: true },
        ],
      },
    },
    {
      id: "department",
      type: "schema",
      position: { x: 500, y: 100 },
      data: {
        label: "Departman Şeması",
        description: "Departman bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "d1", name: "id", type: "string", required: true },
          { id: "d2", name: "ad", type: "string", required: true },
          { id: "d3", name: "yönetici", type: "reference", required: false },
          { id: "d4", name: "açıklama", type: "string", required: false },
        ],
      },
    },
    {
      id: "position",
      type: "schema",
      position: { x: 100, y: 400 },
      data: {
        label: "Pozisyon Şeması",
        description: "Pozisyon bilgilerini içeren şema",
        isActive: true,
        fields: [
          { id: "p1", name: "id", type: "string", required: true },
          { id: "p2", name: "ad", type: "string", required: true },
          { id: "p3", name: "seviye", type: "string", required: true },
          { id: "p4", name: "departman", type: "reference", required: true },
        ],
      },
    },
    {
      id: "leave",
      type: "schema",
      position: { x: 500, y: 400 },
      data: {
        label: "İzin Şeması",
        description: "İzin kayıtlarını içeren şema",
        isActive: true,
        fields: [
          { id: "l1", name: "id", type: "string", required: true },
          { id: "l2", name: "çalışan", type: "reference", required: true },
          { id: "l3", name: "başlangıç", type: "date", required: true },
          { id: "l4", name: "bitiş", type: "date", required: true },
          { id: "l5", name: "tip", type: "string", required: true },
          { id: "l6", name: "durum", type: "string", required: true },
          { id: "l7", name: "açıklama", type: "string", required: false },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "employee",
      target: "department",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e2",
      source: "employee",
      target: "position",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e3",
      source: "position",
      target: "department",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
    {
      id: "e4",
      source: "leave",
      target: "employee",
      animated: true,
      label: "N:1",
      data: { relationType: "oneToMany" },
    },
  ],
};

export const templates: IVersion[] = [
  eCommerceTemplate,
  crmTemplate,
  hrmTemplate,
  gymTemplate,
];

export const defaultNodes: Node[] = eCommerceTemplate.nodes;
export const defaultEdges: Edge[] = eCommerceTemplate.edges;
