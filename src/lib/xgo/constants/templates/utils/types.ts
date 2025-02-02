export const types = {
  template: (name: string, props: any): string => {
    return `import mongoose from "mongoose";
  
  declare global {
    var mongoose:
      | {
          promise: Promise<
            Awaited<ReturnType<typeof import("mongoose").connect>>
          > | null;
          conn: Awaited<ReturnType<typeof import("mongoose").connect>> | null;
        }
      | undefined;
  }
  `;
  },
};
