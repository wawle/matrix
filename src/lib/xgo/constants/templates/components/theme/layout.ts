export const themeLayout = {
  template: (name: string, props: Record<string, any>) => {
    return `
  import { ThemeProvider } from "@/components/theme/provider"
  import { Toaster } from "@/components/ui/sonner"
  export function ThemeLayout({ children }: { children: React.ReactNode }) {
    return (
       <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          {children}
          <Toaster position="bottom-right" />
      </ThemeProvider>
    )
  }
      `;
  },
};
