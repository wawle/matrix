import { IVersion, VersionType } from "@/lib/models/version";

// İK Şablonu
export const hrmModel: IVersion<VersionType.MODEL> = {
  id: "hrm",
  name: "İK",
  description: "İnsan kaynakları yönetimi için temel veritabanı şemaları",
  is_active: false,
  type: VersionType.MODEL,
  nodes: [
    {
      id: "employee",
      position: { x: 100, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "Employee",
        description: "Çalışan bilgilerini içeren şema",
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
      position: { x: 500, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "Department",
        description: "Departman bilgilerini içeren şema",
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
      position: { x: 100, y: 400 },
      type: VersionType.MODEL,
      data: {
        name: "Position",
        description: "Pozisyon bilgilerini içeren şema",
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
      position: { x: 500, y: 400 },
      type: VersionType.MODEL,
      data: {
        name: "Leave",
        description: "İzin kayıtlarını içeren şema",
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
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: { type: "oneToMany" },
    },
    {
      id: "e2",
      source: "employee",
      target: "position",
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: { type: "oneToMany" },
    },
    {
      id: "e3",
      source: "position",
      target: "department",
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: { type: "oneToMany" },
    },
    {
      id: "e4",
      source: "leave",
      target: "employee",
      type: VersionType.MODEL,
      animated: true,
      label: "N:1",
      data: { type: "oneToMany" },
    },
  ],
};
