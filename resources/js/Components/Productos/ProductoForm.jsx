import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductoForm({ productoEditado, onSave }) {
  const [producto, setProducto] = useState({
    nombre: "",
    precio_venta: "",
    stock: 0,
    talle: "",
  });

  useEffect(() => {
    if (productoEditado) setProducto(productoEditado);
  }, [productoEditado]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (producto.id) {
      await axios.put(`/productos/${producto.id}`, producto);
    } else {
      await axios.post("/productos", producto);
    }
    setProducto({ nombre: "", precio_venta: "", stock: 0, talle: "" });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={producto.nombre}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="number"
        name="precio_venta"
        placeholder="Precio"
        value={producto.precio_venta}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={producto.stock}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        name="talle"
        placeholder="Talle"
        value={producto.talle}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {producto.id ? "Actualizar" : "Agregar"}
      </button>
    </form>
  );
}
