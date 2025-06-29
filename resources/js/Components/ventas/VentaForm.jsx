import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function VentaForm({ onVentaRealizada, onClose }) {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [comprobanteExterno, setComprobanteExterno] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [ventaCreada, setVentaCreada] = useState(null);
  const [mostrarDescuentos, setMostrarDescuentos] = useState(false);
  const [descuentos, setDescuentos] = useState({
    porcentaje: 0,
    monto: 0,
    motivo: ""
  });
  const buscadorRef = useRef(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setMostrarBusqueda(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get("/productos/getAllForVentas");
      setProductos(response.data);
      setProductosFiltrados(response.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  // Filtrar productos mientras se escribe
  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.talle?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [busqueda, productos]);

  const agregarProducto = (producto) => {
    const existe = detalleVenta.find(p => p.producto_id === producto.id);
    if (existe) {
      alert("Este producto ya está en la lista");
      return;
    }

    setDetalleVenta([
      ...detalleVenta,
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        talle: producto.talle,
        cantidad: 1,
        precio_venta: parseFloat(producto.precio_venta) || 0,
        stock_disponible: parseInt(producto.stock) || 0,
      },
    ]);
    setBusqueda("");
    setMostrarBusqueda(false);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad) || 0;
    if (cantidad < 1) return;
    
    const nuevosDetalles = detalleVenta.map((item) =>
      item.producto_id === productoId
        ? { ...item, cantidad: cantidad }
        : item
    );
    setDetalleVenta(nuevosDetalles);
  };

  const actualizarPrecio = (productoId, nuevoPrecio) => {
    const precio = parseFloat(nuevoPrecio) || 0;
    if (precio < 0) return;
    
    const nuevosDetalles = detalleVenta.map((item) =>
      item.producto_id === productoId
        ? { ...item, precio_venta: precio }
        : item
    );
    setDetalleVenta(nuevosDetalles);
  };

  const quitarProducto = (productoId) => {
    setDetalleVenta(detalleVenta.filter((item) => item.producto_id !== productoId));
  };

  const enviarVenta = async () => {
    if (detalleVenta.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    if (!comprobanteExterno.trim()) {
      alert("Debe ingresar un comprobante externo");
      return;
    }

    setLoading(true);

    try {
      const ventaPayload = {
        comprobante_externo: comprobanteExterno,
        productos: detalleVenta.map((p) => ({
          producto_id: p.producto_id,
          cantidad: parseInt(p.cantidad) || 0,
          precio_venta: parseFloat(p.precio_venta) || 0,
        })),
        descuento_porcentaje: parseFloat(descuentos.porcentaje) > 0 ? parseFloat(descuentos.porcentaje) : null,
        descuento_monto: parseFloat(descuentos.monto) > 0 ? parseFloat(descuentos.monto) : null,
        motivo_descuento: descuentos.motivo || null,
      };

      const response = await axios.post("/ventas", ventaPayload);
      alert("¡Venta registrada correctamente!");
      setDetalleVenta([]);
      setComprobanteExterno("");
      setDescuentos({ porcentaje: 0, monto: 0, motivo: "" });
      onVentaRealizada();
      onClose();
      setVentaCreada(response.data.id);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error al registrar la venta";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Calcular totales con validación
  const subtotal = detalleVenta.reduce(
    (sum, p) => {
      const precio = parseFloat(p.precio_venta) || 0;
      const cantidad = parseInt(p.cantidad) || 0;
      return sum + (precio * cantidad);
    },
    0
  );
  
  const porcentajeDescuento = parseFloat(descuentos.porcentaje) || 0;
  const montoDescuento = parseFloat(descuentos.monto) || 0;
  
  const descuentoPorcentajeCalculado = subtotal * (porcentajeDescuento / 100);
  const descuentoTotal = descuentoPorcentajeCalculado + montoDescuento;
  const totalFinal = Math.max(0, subtotal - descuentoTotal);

  if (ventaCreada) {
    return (
      <div className="text-center p-6">
        <div className="text-green-600 text-2xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h3 className="text-lg font-semibold mb-2">¡Venta registrada exitosamente!</h3>
        <p className="text-gray-600 mb-4">Venta #{ventaCreada}</p>
        <div className="space-x-2">
          <button
            onClick={() => window.open(`/ventas/comprobante/${ventaCreada}`, '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-print mr-2"></i>
            Imprimir Comprobante
          </button>
          <button
            onClick={() => {
              setVentaCreada(null);
              onClose();
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comprobante Externo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comprobante Externo *
          </label>
          <input
            type="text"
            value={comprobanteExterno}
            onChange={(e) => setComprobanteExterno(e.target.value)}
            placeholder="Ej: FACT-001, TICKET-123"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-end">
          <div className="bg-blue-50 p-3 rounded-md w-full">
            <div className="text-sm text-blue-800">
              <strong>Total Final:</strong> ${totalFinal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de Productos */}
      <div className="relative" ref={buscadorRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar y Agregar Productos
        </label>
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarBusqueda(true);
            }}
            onFocus={() => setMostrarBusqueda(true)}
            placeholder="Escriba para buscar productos por nombre o talle..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-2">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>

        {/* Dropdown de resultados de búsqueda */}
        {mostrarBusqueda && busqueda && productosFiltrados.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => agregarProducto(producto)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{producto.nombre}</div>
                    <div className="text-sm text-gray-600">
                      Talle: {producto.talle} | Stock: {producto.stock} | ${producto.precio_venta}
                    </div>
                  </div>
                  <div className="text-green-600">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grilla de Productos */}
      {detalleVenta.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">Productos en la Venta</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Talle</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cantidad</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Precio Unit.</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Subtotal</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((item, index) => (
                  <tr key={item.producto_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{item.nombre}</div>
                        <div className="text-sm text-gray-500">Stock: {item.stock_disponible}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.talle}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max={item.stock_disponible}
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.producto_id, e.target.value)}
                        className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precio_venta}
                        onChange={(e) => actualizarPrecio(item.producto_id, e.target.value)}
                        className="w-24 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900">
                      ${((parseFloat(item.precio_venta) || 0) * (parseInt(item.cantidad) || 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => quitarProducto(item.producto_id)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                        title="Quitar producto"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botón para mostrar/ocultar descuentos */}
      {detalleVenta.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setMostrarDescuentos(!mostrarDescuentos)}
            className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors"
          >
            <i className={`fas fa-tags ${mostrarDescuentos ? 'text-yellow-600' : 'text-yellow-500'}`}></i>
            <span>{mostrarDescuentos ? 'Ocultar' : 'Mostrar'} Descuentos y Promociones</span>
            <i className={`fas fa-chevron-${mostrarDescuentos ? 'up' : 'down'} text-sm`}></i>
          </button>
        </div>
      )}

      {/* Sección de Descuentos (condicional) */}
      {detalleVenta.length > 0 && mostrarDescuentos && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-3">
            <i className="fas fa-tags mr-2"></i>
            Descuentos y Promociones
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento % (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={descuentos.porcentaje}
                onChange={(e) => setDescuentos({
                  ...descuentos,
                  porcentaje: parseFloat(e.target.value) || 0
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento $ (Monto fijo)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={descuentos.monto}
                onChange={(e) => setDescuentos({
                  ...descuentos,
                  monto: parseFloat(e.target.value) || 0
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo del Descuento
              </label>
              <input
                type="text"
                value={descuentos.motivo}
                onChange={(e) => setDescuentos({
                  ...descuentos,
                  motivo: e.target.value
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Cliente frecuente, Promoción"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumen de Totales */}
      {detalleVenta.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Resumen de Totales</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            {porcentajeDescuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento ({porcentajeDescuento}%):</span>
                <span>-${descuentoPorcentajeCalculado.toFixed(2)}</span>
              </div>
            )}
            
            {montoDescuento > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento (Monto fijo):</span>
                <span>-${montoDescuento.toFixed(2)}</span>
              </div>
            )}
            
            {descuentoTotal > 0 && (
              <div className="flex justify-between text-green-600 font-medium border-t pt-2">
                <span>Total Descuentos:</span>
                <span>-${descuentoTotal.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Final:</span>
              <span className="text-blue-600">${totalFinal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-lg">
          <span className="font-medium text-gray-700">Total a Pagar: </span>
          <span className="font-bold text-2xl text-blue-600">${totalFinal.toFixed(2)}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={enviarVenta}
            disabled={loading || detalleVenta.length === 0}
            className={`px-6 py-2 rounded-md text-white ${
              loading || detalleVenta.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Procesando...
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                Confirmar Venta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
