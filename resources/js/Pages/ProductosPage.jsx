import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Paginator from '../Components/Paginator';
import ProductoImportador from '../Components/Productos/ProductoImportador';

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
    per_page: 20
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [mostrarImportador, setMostrarImportador] = useState(false);

  const cargarProductos = () => {
    axios.get('/productos/getAll?page=' + currentPage).then(res => {
      console.log('API Response:', res.data);
      setProductos(res.data.data);
      setMeta(res.data);
    });
  };

  useEffect(() => {
    cargarProductos();
  }, [currentPage]);

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
      await axios.delete(`/productos/${id}`);
      cargarProductos();
    };
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (modo === "crear") {
      await axios.post('/productos', form);
    } else {
      await axios.put(`/productos/${productoEditando.id}`, form);
    }
    setModalVisible(false);
    cargarProductos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Productos</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarImportador(!mostrarImportador)}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-upload mr-2"></i>
            {mostrarImportador ? 'Ocultar Importador' : 'Importar Productos'}
          </button>
          <button
            onClick={abrirModalCrear}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-plus mr-2"></i>
            Agregar Producto
          </button>
        </div>
      </div>

      {mostrarImportador && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
          <h3 className="text-lg font-semibold mb-2">Importar Productos desde Excel/CSV</h3>
          <p className="text-sm text-gray-600 mb-3">
            El archivo debe contener las columnas: nombre, precio_venta, stock, talle
          </p>
          <ProductoImportador onImport={cargarProductos} />
        </div>
      )}

      <table className="w-full border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Talle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-t text-center">
              <td>{p.nombre}</td>
              <td>${p.precio_venta}</td>
              <td>{p.stock}</td>
              <td>{p.talle}</td>
              <td>
                <button
                  className="bg-blue-600 text-white px-2 py-2 rounded"
                  onClick={() => abrirModalEditar(p)}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-2 ml-2 py-2 rounded"
                  onClick={() => handleDelete(p.id)}
                >
                  <i className="fas fa-trash mr-2"></i>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginator meta={meta} onPageChange={setCurrentPage} />

      {/* Modal */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-xl font-semibold mb-4">
          {modo === "crear" ? "Agregar Producto" : "Editar Producto"}
        </h3>
        <form onSubmit={guardarProducto} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Precio Venta"
            value={form.precio_venta}
            onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />

        <input
            type="text"
            placeholder="Talle"
            value={form.talle}
            onChange={(e) => setForm({ ...form, talle: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
}

ProductosPage.layout = (page) => <Layout>{page}</Layout>;
export default ProductosPage;
