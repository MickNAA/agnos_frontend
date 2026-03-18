import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Agnos Patient System</h1>
        <p className="text-gray-500 text-lg">Real-time patient intake & staff monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/patient-form" className="card hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">🩺</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
            Patient Form
          </h2>
          <p className="text-sm text-gray-500">
            Enter your personal details before your visit
          </p>
        </Link>

        <Link href="/staff-view" className="card hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-4">👩‍⚕️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
            Staff View
          </h2>
          <p className="text-sm text-gray-500">
            Monitor patient intake in real-time
          </p>
        </Link>
      </div>
    </main>
  );
}
