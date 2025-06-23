import { useState } from "react";
import ProductoList from "../components/productos/ProductoList";
import ProductoForm from "../components/productos/ProductoForm";

export default function ProductosPage() {
  const [productoEditado, setProductoEditado] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  const handleGuardar = () => {
    setProductoEditado(null);
    setRefrescar(!refrescar);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
      <ProductoForm productoEditado={productoEditado} onSave={handleGuardar} />
      <ProductoList key={refrescar} onEdit={setProductoEditado} />
    </div>
  );
}
