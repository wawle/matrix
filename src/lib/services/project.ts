
    import { Project, IProject } from "@/lib/models/project";
    import connectDB from "@/lib/db";
    
    export async function getProjects(): Promise<IProject[]> {
      try {
        await connectDB();
        const projects = await Project.find().sort({ createdAt: -1 });
        return projects;
      } catch (error: any) {
        throw new Error(error.message || "Project listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getProjectById(id: string): Promise<IProject> {
        try {
        await connectDB();
        const project = await Project.findById(id);
        if (!project) {
          throw new Error("Project bulunamadı");
        }
        return project;
      } catch (error: any) {
        throw new Error(error.message || "Project alınırken bir hata oluştu");
      }
    }
    
    export async function createProject(data: any): Promise<IProject> {
      try {
        await connectDB();
        const project = await Project.create(data);
        return project;
      } catch (error: any) {
        throw new Error(error.message || "Project oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateProject(id: string, data: any): Promise<IProject> {
      try {
        await connectDB();
        const project = await Project.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!project) {
          throw new Error("Project bulunamadı");
        }
        return project;
      } catch (error: any) {
        throw new Error(error.message || "Project güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteProject(id: string): Promise<IProject> {
      try {
        await connectDB();
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
          throw new Error("Project bulunamadı");
        }
        return project;
      } catch (error: any) {
        throw new Error(error.message || "Project silinirken bir hata oluştu");
      }
    }
    