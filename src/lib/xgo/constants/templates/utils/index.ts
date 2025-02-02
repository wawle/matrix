export const utils = {
  template: (name: string, props: any): string => {
    return `
    import { type ClassValue, clsx } from "clsx";
    import { twMerge } from "tailwind-merge";
    import { Schema } from "mongoose";
    import { z } from "zod";
    
    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    
   
    `;
  },
};
