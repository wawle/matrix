
    import { Edge, IEdge } from "@/lib/models/edge";
    import connectDB from "@/lib/db";
    
    export async function getEdges(): Promise<IEdge[]> {
      try {
        await connectDB();
        const edges = await Edge.find().sort({ createdAt: -1 });
        return edges;
      } catch (error: any) {
        throw new Error(error.message || "Edge listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getEdgeById(id: string): Promise<IEdge> {
        try {
        await connectDB();
        const edge = await Edge.findById(id);
        if (!edge) {
          throw new Error("Edge bulunamadı");
        }
        return edge;
      } catch (error: any) {
        throw new Error(error.message || "Edge alınırken bir hata oluştu");
      }
    }
    
    export async function createEdge(data: any): Promise<IEdge> {
      try {
        await connectDB();
        const edge = await Edge.create(data);
        return edge;
      } catch (error: any) {
        throw new Error(error.message || "Edge oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateEdge(id: string, data: any): Promise<IEdge> {
      try {
        await connectDB();
        const edge = await Edge.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!edge) {
          throw new Error("Edge bulunamadı");
        }
        return edge;
      } catch (error: any) {
        throw new Error(error.message || "Edge güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteEdge(id: string): Promise<IEdge> {
      try {
        await connectDB();
        const edge = await Edge.findByIdAndDelete(id);
        if (!edge) {
          throw new Error("Edge bulunamadı");
        }
        return edge;
      } catch (error: any) {
        throw new Error(error.message || "Edge silinirken bir hata oluştu");
      }
    }
    