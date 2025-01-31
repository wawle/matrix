
          export default function NotFound() {
            return (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <h2 className="mb-2 text-2xl font-semibold">Not Found</h2>
                <p className="mb-4 text-gray-600">The requested resource could not be found.</p>
                <a
                  href="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Go back home
                </a>
              </div>
            )
          }