export const eslint = {
  template: (name: string, props: any): string => {
    return `
    import { dirname } from "path";
    import { fileURLToPath } from "url";
    import { FlatCompat } from "@eslint/eslintrc";
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    const compat = new FlatCompat({
      baseDirectory: __dirname,
    });
    
    const eslintConfig = [
      ...compat.extends("next/core-web-vitals", "next/typescript"),
      "plugin:@typescript-eslint/no-explicit-any",
      "off",
      "plugin:@typescript-eslint/no-unused-vars",
      "off",
    ];
    
    export default eslintConfig;
    `;
  },
};
