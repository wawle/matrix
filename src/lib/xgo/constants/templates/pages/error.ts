export const error = {
  template: (name: string, props: Record<string, any>): string => {
    return `
          'use client';
          
          export default function Error({
            error,
            reset,
          }: {
            error: Error & { digest?: string }
            reset: () => void
          }) {
            return (
              <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Something went wrong!</h2>
                  <button
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-sm"
                    onClick={() => reset()}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )
          }`;
  },
};
