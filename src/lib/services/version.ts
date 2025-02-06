import { Version, IVersion } from "@/lib/models/version";
import connectDB from "@/lib/db";
import { Edge } from "../models/edge";
import { Node } from "../models/node";
import { ErrorResponse } from "../middlewares/error";
import { asyncFnService } from "../middlewares/async";

export const getVersions = asyncFnService(async (): Promise<IVersion[]> => {
  await connectDB();
  const versions = await Version.find().sort({ createdAt: -1 });
  return versions;
});

export const getVersionById = asyncFnService(
  async (id: string): Promise<IVersion> => {
    await connectDB();
    const version = await Version.findById(id).populate([
      {
        path: "nodes",
        model: Node,
      },
      {
        path: "edges",
        model: Edge,
      },
    ]);
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);

export const createVersion = asyncFnService(
  async (data: any): Promise<IVersion> => {
    await connectDB();
    const version = await Version.create(data);
    if (!version) {
      throw new ErrorResponse("Version oluşturulurken bir hata oluştu", 400);
    }
    return version;
  }
);

export const updateVersion = asyncFnService(
  async (id: string, data: any): Promise<IVersion> => {
    await connectDB();
    const version = await Version.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);

export const deleteVersion = asyncFnService(
  async (id: string): Promise<IVersion> => {
    await connectDB();
    const version = await Version.findByIdAndDelete(id);
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);
