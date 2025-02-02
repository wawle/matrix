import { Node, INode } from "@/lib/models/node";
import connectDB from "@/lib/db";

export async function getNodes(): Promise<INode[]> {
  try {
    await connectDB();
    const nodes = await Node.find().sort({ createdAt: -1 });
    return nodes;
  } catch (error: any) {
    throw new Error(error.message || "Node listesi alınırken bir hata oluştu");
  }
}

export async function getNodeById(id: string): Promise<INode> {
  try {
    await connectDB();
    const node = await Node.findById(id);
    if (!node) {
      throw new Error("Node bulunamadı");
    }
    return node;
  } catch (error: any) {
    throw new Error(error.message || "Node alınırken bir hata oluştu");
  }
}

export async function createNode(data: any): Promise<INode> {
  try {
    await connectDB();
    const node = await Node.create(data);
    return node;
  } catch (error: any) {
    throw new Error(error.message || "Node oluşturulurken bir hata oluştu");
  }
}

export async function updateNode(id: string, data: INode): Promise<INode> {
  try {
    await connectDB();
    const node = await Node.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!node) {
      throw new Error("Node bulunamadı");
    }
    return node;
  } catch (error: any) {
    throw new Error(error.message || "Node güncellenirken bir hata oluştu");
  }
}

export async function deleteNode(id: string): Promise<INode> {
  try {
    await connectDB();
    const node = await Node.findByIdAndDelete(id);
    if (!node) {
      throw new Error("Node bulunamadı");
    }
    return node;
  } catch (error: any) {
    throw new Error(error.message || "Node silinirken bir hata oluştu");
  }
}
