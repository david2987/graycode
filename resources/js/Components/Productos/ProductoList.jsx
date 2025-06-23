import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductoList({ onEdit }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get("/productos/getAll");
    setProductos(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    await axios.delete(`/api/productos/${id}`);
    fetchProductos();
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Talle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id} className="border-t">
              <td className="p-2">{producto.nombre}</td>
              <td>${producto.precio_venta}</td>
              <td>{producto.stock}</td>
              <td>{producto.talle}</td>
              <td className="space-x-2">
                <button
                  onClick={() => onEdit(producto)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
