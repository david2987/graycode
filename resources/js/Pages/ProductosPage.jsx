import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Paginator from '../Components/Paginator';
import ProductoImportador from '../Components/Productos/ProductoImportador';
import ProductoBuscador from '../Components/Productos/ProductoBuscador';

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modo, setModo] = useState("crear"); // o "editar"
  const [form, setForm] = useState({ nombre: "", precio_venta: "", stock: "", talle: "" });
  const [productoEditando, setProductoEditando] = useState(null);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [mostrarImportador, setMostrarImportador] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [loading, setLoading] = useState(false);

  const cargarProductos = (filtros = {}) => {
    setLoading(true);
    
    // Construir query string con filtros
    const params = new URLSearchParams();
    params.append('page', currentPage);
    
    // Agregar filtros
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
        params.append(key, filtros[key]);
      }
    });

    axios.get(`/productos/getAll?${params.toString()}`).then(res => {
      console.log('API Response:', res.data);
      setProductos(res.data.data);
      setMeta(res.data);
      setLoading(false);
    }).catch(error => {
      console.error('Error cargando productos:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargarProductos(filtrosActivos);
  }, [currentPage]);

  const handleSearch = (filtros) => {
    setFiltrosActivos(filtros);
    setCurrentPage(1); // Resetear a la primera página
    cargarProductos(filtros);
  };

  const handleClear = () => {
    setFiltrosActivos({});
    setCurrentPage(1);
    cargarProductos({});
  };

  const abrirModalCrear = () => {
    setModo("crear");
    setForm({ nombre: "", precio_venta: "", stock: "", talle: "" });
    setModalVisible(true);
  };

  const abrirModalEditar = (producto) => {
    setModo("editar");
    setForm({
      nombre: producto.nombre,
      precio_venta: producto.precio_venta,
      stock: producto.stock,
      talle: producto.talle,
    });
    setProductoEditando(producto);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await axios.delete(`/productos/${id}`);
      cargarProductos(filtrosActivos);
    } catch (error) {
      alert("Error al eliminar el producto");
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      if (modo === "crear") {
        await axios.post('/productos', form);
      } else {
        await axios.put(`/productos/${productoEditando.id}`, form);
      }
      setModalVisible(false);
      cargarProductos(filtrosActivos);
    } catch (error) {
      alert("Error al guardar el producto");
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Agotado', class: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { text: 'Stock Bajo', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Disponible', class: 'bg-green-100 text-green-800' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
          <p className="text-gray-600 mt-1">Administra tu catálogo de productos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarImportador(!mostrarImportador)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-upload mr-2"></i>
            {mostrarImportador ? 'Ocultar Importador' : 'Importar Productos'}
          </button>
          <button
            onClick={abrirModalCrear}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Buscador avanzado */}
      <ProductoBuscador onSearch={handleSearch} onClear={handleClear} />

      {/* Importador */}
      {mostrarImportador && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <h3 className="text-lg font-semibold mb-2">Importar Productos desde Excel/CSV</h3>
          <p className="text-sm text-gray-600 mb-3">
            El archivo debe contener las columnas: nombre, precio_venta, stock, talle
          </p>
          <ProductoImportador onImport={() => cargarProductos(filtrosActivos)} />
        </div>
      )}

      {/* Resumen de resultados */}
      {Object.keys(filtrosActivos).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-filter text-blue-600"></i>
              <span className="text-sm text-blue-800">
                Mostrando {meta.total} producto{meta.total !== 1 ? 's' : ''} 
                {Object.keys(filtrosActivos).length > 0 && ' con filtros aplicados'}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              <i className="fas fa-times mr-1"></i>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Talle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                      Cargando productos...
                    </div>
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <i className="fas fa-box-open text-4xl mb-2"></i>
                    <p>No se encontraron productos</p>
                    {Object.keys(filtrosActivos).length > 0 && (
                      <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    )}
                  </td>
                </tr>
              ) : (
                productos.map((p) => {
                  const stockStatus = getStockStatus(p.stock);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{p.nombre}</div>
                          <div className="text-sm text-gray-500">ID: {p.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ${parseFloat(p.precio_venta).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{p.stock}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.class}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.talle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            onClick={() => abrirModalEditar(p)}
                            title="Editar producto"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Editar
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            onClick={() => handleDelete(p.id)}
                            title="Eliminar producto"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {meta.total > 0 && (
        <div className="mt-6">
          <Paginator meta={meta} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Modal */}
      <Modal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        title={modo === "crear" ? "Agregar Producto" : "Editar Producto"}
      >
        <form onSubmit={guardarProducto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              placeholder="Ej: Camiseta Básica"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
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
              min="0"
              placeholder="0.00"
              value={form.precio_venta}
              onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talle *
            </label>
            <input
              type="text"
              placeholder="Ej: M, L, XL, 42, etc."
              value={form.talle}
              onChange={(e) => setForm({ ...form, talle: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalVisible(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              {modo === "crear" ? "Crear Producto" : "Actualizar Producto"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

ProductosPage.layout = (page) => <Layout>{page}</Layout>;
export default ProductosPage;
