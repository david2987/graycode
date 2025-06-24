import { Link } from '@inertiajs/react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistema de Caja - Local de Ropa</h1>
          <nav className="space-x-4">
            <Link href="/productos" className="text-blue-600 hover:underline">Productos</Link>
            <Link href="/ventas" className="text-blue-600 hover:underline">Ventas</Link>
            <Link href="/caja" className="text-blue-600 hover:underline">Caja</Link>
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
