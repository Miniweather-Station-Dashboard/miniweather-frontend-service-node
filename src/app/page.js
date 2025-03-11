"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Dashboard Miniweather Station 
        </h1>
        <p className="text-lg max-w-xl mx-auto text-gray-400">
          Memantau data suhu dan lingkungan secara real-time untuk kesiapsiagaan menghadapi bencana di daerah pesisir.
        </p>
      </header>

      <div className="w-24 h-1 bg-gray-600 my-6 rounded-full"></div>

      <footer className="mt-12 text-center">
        <p className="mb-4 text-gray-400">Siap menghadapi bencana dengan pemantauan cuaca yang akurat.</p>
        <button className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition">
          Menuju ke Dashboard
        </button>
      </footer>
    </div>
  );
}