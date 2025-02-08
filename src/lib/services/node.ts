import { Node, INode } from "@/lib/models/node";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";
import { VersionType } from "../models/version";

export const getNodes = asyncFnService(
  async (): Promise<INode<VersionType>[]> => {
    await connectDB();
    const nodes = await Node.find().sort({ createdAt: -1 });
    return nodes;
  }
);

export const getNodeById = asyncFnService(
  async (id: string): Promise<INode<VersionType>> => {
    await connectDB();
    const node = await Node.findById(id);
    if (!node) {
      throw new ErrorResponse("Node bulunamadı", 404);
    }
    return node;
  }
);

export const createNode = asyncFnService(
  async (data: any): Promise<INode<VersionType>> => {
    await connectDB();
    const node = await Node.create(data);
    if (!node) {
      throw new ErrorResponse("Node oluşturulurken bir hata oluştu", 400);
    }
    return node;
  }
);

export const updateNode = asyncFnService(
  async (id: string, data: INode<VersionType>): Promise<INode<VersionType>> => {
    await connectDB();
    const node = await Node.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!node) {
      throw new ErrorResponse("Node bulunamadı", 404);
    }
    return node;
  }
);

export const deleteNode = asyncFnService(
  async (id: string): Promise<INode<VersionType>> => {
    await connectDB();
    const node = await Node.findByIdAndDelete(id);
    if (!node) {
      throw new ErrorResponse("Node bulunamadı", 404);
    }
    return node;
  }
);
