import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Page not found
        </h1>
        <p className="text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}
