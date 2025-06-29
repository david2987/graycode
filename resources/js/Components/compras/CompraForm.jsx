import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function CompraForm({ onCompraRealizada, onClose }) {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [detalleCompra, setDetalleCompra] = useState([]);
  const [comprobanteExterno, setComprobanteExterno] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [compraCreada, setCompraCreada] = useState(null);
  const [modoNuevoProducto, setModoNuevoProducto] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    talle: "",
    precio_venta: "",
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

  const agregarProductoExistente = (producto) => {
    const existe = detalleCompra.find(p => p.producto_id === producto.id);
    if (existe) {
      alert("Este producto ya está en la lista");
      return;
    }

    setDetalleCompra([
      ...detalleCompra,
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        talle: producto.talle,
        cantidad: 1,
        precio_compra: producto.precio_venta * 0.7, // Precio de compra sugerido
        nuevo_producto: false,
      },
    ]);
    setBusqueda("");
    setMostrarBusqueda(false);
  };

  const agregarNuevoProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio_venta) {
      alert("Debe completar nombre y precio de venta");
      return;
    }

    const existe = detalleCompra.find(p => 
      p.nuevo_producto && p.nombre === nuevoProducto.nombre && p.talle === nuevoProducto.talle
    );
    if (existe) {
      alert("Este producto ya está en la lista");
      return;
    }

    setDetalleCompra([
      ...detalleCompra,
      {
        ...nuevoProducto,
        cantidad: 1,
        precio_compra: nuevoProducto.precio_venta * 0.7, // Precio de compra sugerido
        nuevo_producto: true,
      },
    ]);

    setNuevoProducto({ nombre: "", talle: "", precio_venta: "" });
    setModoNuevoProducto(false);
  };

  const actualizarCantidad = (index, cantidad) => {
    const nuevosDetalles = [...detalleCompra];
    nuevosDetalles[index].cantidad = parseInt(cantidad);
    setDetalleCompra(nuevosDetalles);
  };

  const actualizarPrecioCompra = (index, precio) => {
    const nuevosDetalles = [...detalleCompra];
    nuevosDetalles[index].precio_compra = parseFloat(precio);
    setDetalleCompra(nuevosDetalles);
  };

  const eliminarProducto = (index) => {
    setDetalleCompra(detalleCompra.filter((_, i) => i !== index));
  };

  const enviarCompra = async () => {
    if (detalleCompra.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    if (!comprobanteExterno.trim()) {
      alert("Debe ingresar un comprobante externo");
      return;
    }

    setLoading(true);

    try {
      const compraPayload = {
        comprobante_externo: comprobanteExterno,
        productos: detalleCompra.map((p) => ({
          producto_id: p.nuevo_producto ? null : p.producto_id,
          nuevo_producto: p.nuevo_producto,
          nombre: p.nuevo_producto ? p.nombre : null,
          talle: p.nuevo_producto ? p.talle : null,
          precio_venta: p.nuevo_producto ? p.precio_venta : null,
          cantidad: p.cantidad,
          precio_compra: p.precio_compra,
        })),
      };

      const response = await axios.post("/compras", compraPayload);
      alert("¡Compra registrada correctamente!");
      setDetalleCompra([]);
      setComprobanteExterno("");
      onCompraRealizada();
      onClose();
      setCompraCreada(response.data.id);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error al registrar la compra";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const total = detalleCompra.reduce(
    (sum, p) => sum + p.precio_compra * p.cantidad,
    0
  );

  if (compraCreada) {
    return (
      <div className="text-center p-6">
        <div className="text-green-600 text-2xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h3 className="text-lg font-semibold mb-2">¡Compra registrada exitosamente!</h3>
        <p className="text-gray-600 mb-4">Compra #{compraCreada}</p>
        <div className="space-x-2">
          <button
            onClick={() => window.open(`/compras/comprobante/${compraCreada}`, '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-print mr-2"></i>
            Imprimir Comprobante
          </button>
          <button
            onClick={() => {
              setCompraCreada(null);
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
          <div className="bg-red-50 p-3 rounded-md w-full">
            <div className="text-sm text-red-800">
              <strong>Total de la Compra:</strong> ${total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de Productos */}
      <div className="relative" ref={buscadorRef}>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Producto Existente
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarBusqueda(true);
              }}
              onFocus={() => setMostrarBusqueda(true)}
              placeholder="Buscar por nombre o talle..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setModoNuevoProducto(!modoNuevoProducto)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              <i className="fas fa-plus mr-2"></i>
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Dropdown de productos existentes */}
        {mostrarBusqueda && productosFiltrados.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => agregarProductoExistente(producto)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                <div className="font-medium">{producto.nombre}</div>
                <div className="text-sm text-gray-600">
                  Talle: {producto.talle} | Stock: {producto.stock} | Precio: ${producto.precio_venta}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario para nuevo producto */}
      {modoNuevoProducto && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-3">Agregar Nuevo Producto</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                placeholder="Nombre del producto"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Talle
              </label>
              <input
                type="text"
                value={nuevoProducto.talle}
                onChange={(e) => setNuevoProducto({...nuevoProducto, talle: e.target.value})}
                placeholder="Talle"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta *
              </label>
              <input
                type="number"
                step="0.01"
                value={nuevoProducto.precio_venta}
                onChange={(e) => setNuevoProducto({...nuevoProducto, precio_venta: e.target.value})}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={agregarNuevoProducto}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              <i className="fas fa-plus mr-1"></i>
              Agregar a la Lista
            </button>
            <button
              onClick={() => {
                setModoNuevoProducto(false);
                setNuevoProducto({ nombre: "", talle: "", precio_venta: "" });
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {detalleCompra.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Productos de la Compra</h4>
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detalleCompra.map((producto, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.nombre}
                      {producto.nuevo_producto && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Nuevo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.talle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidad(index, e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={producto.precio_compra}
                        onChange={(e) => actualizarPrecioCompra(index, e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-center"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${(producto.cantidad * producto.precio_compra).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => eliminarProducto(index)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={enviarCompra}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-save mr-2"></i>
          )}
          Registrar Compra
        </button>
      </div>
    </div>
  );
} 