import { useEffect, useState } from "react";
import axios from "axios";

export default function VentaForm({ onVentaRealizada }) {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [detalleVenta, setDetalleVenta] = useState([]);

  useEffect(() => {
    axios.get("/api/productos").then((res) => setProductos(res.data));
  }, []);

  const agregarProducto = () => {
    const producto = productos.find((p) => p.id === parseInt(productoSeleccionado));
    if (!producto || cantidad < 1) return;

    const existente = detalleVenta.find((d) => d.id === producto.id);
    if (existente) {
      const actualizada = detalleVenta.map((d) =>
        d.id === producto.id ? { ...d, cantidad: d.cantidad + cantidad } : d
      );
      setDetalleVenta(actualizada);
    } else {
      setDetalleVenta([
        ...detalleVenta,
        { ...producto, cantidad: parseInt(cantidad) },
      ]);
    }

    setCantidad(1);
    setProductoSeleccionado("");
  };

  const quitarProducto = (id) => {
    setDetalleVenta(detalleVenta.filter((p) => p.id !== id));
  };

  const enviarVenta = async () => {
    const ventaPayload = {
      comprobante_externo: `EXT-${Date.now()}`,
      productos: detalleVenta.map((p) => ({
        id: p.id,
        cantidad: p.cantidad,
      })),
    };

    try {
      await axios.post("/api/ventas", ventaPayload);
      alert("¡Venta registrada correctamente!");
      setDetalleVenta([]);
      onVentaRealizada();
    } catch (err) {
      alert("Error al registrar la venta: " + err.response?.data?.error);
    }
  };

  const total = detalleVenta.reduce(
    (sum, p) => sum + p.precio_venta * p.cantidad,
    0
  );

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow">
      <div className="flex gap-2">
        <select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Seleccionar producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.stock} disponibles)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={agregarProducto}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      {detalleVenta.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="font-bold mb-2">Detalle de venta</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalleVenta.map((item) => (
                <tr key={item.id} className="border-t">
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio_venta}</td>
                  <td>${(item.precio_venta * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button
                      className="text-red-600"
                      onClick={() => quitarProducto(item.id)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-2 font-bold">
            Total: ${total.toFixed(2)}
          </div>

          <button
            onClick={enviarVenta}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Confirmar Venta
          </button>
        </div>
      )}
    </div>
  );
}
