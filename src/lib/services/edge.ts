import { Edge, IEdge } from "@/lib/models/edge";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getEdges = asyncFnService(async (): Promise<IEdge[]> => {
  await connectDB();
  const edges = await Edge.find()
    .select("sourceName targetName label")
    .sort({ createdAt: -1 });
  return edges;
});

export const getEdgeById = asyncFnService(
  async (id: string): Promise<IEdge> => {
    await connectDB();
    const edge = await Edge.findById(id);
    if (!edge) {
      throw new ErrorResponse("Edge bulunamadı", 404);
    }
    return edge;
  }
);

export const createEdge = asyncFnService(async (data: any): Promise<IEdge> => {
  await connectDB();
  const edge = await Edge.create(data);
  if (!edge) {
    throw new ErrorResponse("Edge oluşturulurken bir hata oluştu", 500);
  }
  return edge;
});

export const updateEdge = asyncFnService(
  async (id: string, data: any): Promise<IEdge> => {
    await connectDB();
    const edge = await Edge.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!edge) {
      throw new ErrorResponse("Edge bulunamadı", 404);
    }
    return edge;
  }
);

export const deleteEdge = asyncFnService(async (id: string): Promise<IEdge> => {
  await connectDB();
  const edge = await Edge.findByIdAndDelete(id);
  if (!edge) {
    throw new ErrorResponse("Edge bulunamadı", 404);
  }
  return edge;
});
