import { Version, IVersion, VersionType } from "@/lib/models/version";
import connectDB from "@/lib/db";
import { ErrorResponse } from "../middlewares/error";
import { asyncFnService } from "../middlewares/async";

export const getVersions = asyncFnService(
  async (): Promise<IVersion<VersionType>[]> => {
    await connectDB();
    const versions = await Version.find().sort({ createdAt: -1 });
    return versions;
  }
);

export const getVersionById = asyncFnService(
  async (id: string): Promise<IVersion<VersionType>> => {
    await connectDB();
    const version = await Version.findById(id);
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);

export const getVersionBySlug = asyncFnService(
  async (slug: string): Promise<IVersion<VersionType>> => {
    await connectDB();
    const version = await Version.findOne({ slug });
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);

export const createVersion = asyncFnService(
  async (data: any): Promise<IVersion<VersionType>> => {
    await connectDB();
    const version = await Version.create(data);
    if (!version) {
      throw new ErrorResponse("Version oluşturulurken bir hata oluştu", 400);
    }
    return version;
  }
);

export const updateVersion = asyncFnService(
  async (id: string, data: any): Promise<IVersion<VersionType>> => {
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
  async (id: string): Promise<IVersion<VersionType>> => {
    await connectDB();
    const version = await Version.findByIdAndDelete(id);
    if (!version) {
      throw new ErrorResponse("Version bulunamadı", 404);
    }
    return version;
  }
);
