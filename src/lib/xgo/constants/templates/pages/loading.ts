export const loading = {
  template: (name: string, props: Record<string, any>): string => {
    return `
export default function Loading() {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}
    `;
  },
};
