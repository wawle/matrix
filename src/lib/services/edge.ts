import { VersionType } from "@/lib/models/version";
import connectDB from "@/lib/db";
import { ErrorResponse } from "../middlewares/error";
import { asyncFnService } from "../middlewares/async";
import { IEdge, Edge } from "../models/edge";
import { listing } from "../middlewares/listing";

export const getEdges = asyncFnService(
  async (
    queryParams: any
  ): Promise<{
    data: IEdge<VersionType>[];
    total: number;
    pageCount: number;
    pagination: { next?: { page: number; limit: number } };
  }> => {
    await connectDB();
    const edges = await listing<IEdge<VersionType>>(Edge, queryParams);
    return edges;
  }
);

export const getEdgeById = asyncFnService(
  async (id: string): Promise<IEdge<VersionType>> => {
    await connectDB();
    const edge = await Edge.findById(id);
    if (!edge) {
      throw new ErrorResponse("Edge bulunamadı", 404);
    }
    return edge;
  }
);

export const createEdge = asyncFnService(
  async (data: any): Promise<IEdge<VersionType>> => {
    await connectDB();
    const edge = await Edge.create(data);
    if (!edge) {
      throw new ErrorResponse("Edge oluşturulurken bir hata oluştu", 400);
    }
    return edge;
  }
);

export const updateEdge = asyncFnService(
  async (id: string, data: any): Promise<IEdge<VersionType>> => {
    await connectDB();
    const edge = await Edge.findByIdAndUpdate(id, data);
    if (!edge) {
      throw new ErrorResponse("Edge bulunamadı", 404);
    }
    return edge;
  }
);

export const deleteEdge = asyncFnService(
  async (id: string): Promise<IEdge<VersionType>> => {
    await connectDB();
    const edge = await Edge.findByIdAndDelete(id);
    if (!edge) {
      throw new ErrorResponse("Edge bulunamadı", 404);
    }
    return edge;
  }
);
