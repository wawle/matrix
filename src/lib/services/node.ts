import { VersionType } from "@/lib/models/version";
import connectDB from "@/lib/db";
import { ErrorResponse } from "../middlewares/error";
import { asyncFnService } from "../middlewares/async";
import { INode, Node } from "../models/node";
import { listing } from "../middlewares/listing";

export const getNodes = asyncFnService(
  async (
    queryParams: any
  ): Promise<{
    data: INode<VersionType>[];
    total: number;
    pageCount: number;
    pagination: { next?: { page: number; limit: number } };
  }> => {
    await connectDB();
    const nodes = await listing<INode<VersionType>>(Node, queryParams);
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
  async (id: string, data: any): Promise<INode<VersionType>> => {
    await connectDB();
    const node = await Node.findByIdAndUpdate(id, data);
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
