import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CajaPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [balance, setBalance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ tipo: "ingreso", monto: "", descripcion: "" });
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    tipo: '',
    monto_min: '',
    monto_max: '',
    descripcion: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const cargar = async () => {
    const params = new URLSearchParams({
      ...filtros
    });
    
    const [movRes, balRes] = await Promise.all([
      axios.get(`/caja/getAll?${params}`),
      // axios.get("/caja/balance"),
    ]);
    setMovimientos(movRes.data);
    // setBalance(balRes.data);
  };

  useEffect(() => {
    cargar();
  }, [filtros]);

  const guardar = async (e) => {
    e.preventDefault();
    await axios.post("/caja", form);
    setForm({ tipo: "ingreso", monto: "", descripcion: "" });
    setModalVisible(false);
    cargar();
  };

  const limpiarFiltros = () => {
    setFiltros({
      desde: '',
      hasta: '',
      tipo: '',
      monto_min: '',
      monto_max: '',
      descripcion: ''
    });
  };

  const aplicarFiltros = () => {
    // Los filtros se aplican automáticamente al cambiar el estado
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Caja</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMostrarFiltros(!mostrarFiltros)} 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            <i className="fas fa-filter mr-2"></i>
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
          <button onClick={() => setModalVisible(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            <i className="fas fa-plus mr-2"></i>
            Registrar Movimiento
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams(filtros);
              window.open(`/reporte-caja/pdf?${params}`, "_blank");
            }} 
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-file-pdf"></i> Reporte
          </button>
        </div>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold mb-3">Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => setFiltros({...filtros, desde: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => setFiltros({...filtros, hasta: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Movimiento
              </label>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Mínimo
              </label>
              <input
                type="number"
                step="0.01"
                value={filtros.monto_min}
                onChange={(e) => setFiltros({...filtros, monto_min: e.target.value})}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Máximo
              </label>
              <input
                type="number"
                step="0.01"
                value={filtros.monto_max}
                onChange={(e) => setFiltros({...filtros, monto_max: e.target.value})}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={filtros.descripcion}
                onChange={(e) => setFiltros({...filtros, descripcion: e.target.value})}
                placeholder="Buscar en descripción..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={aplicarFiltros}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <i className="fas fa-search mr-2"></i>
              Aplicar Filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <i className="fas fa-times mr-2"></i>
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Indicador de filtros aplicados */}
      {(filtros.desde || filtros.hasta || filtros.tipo || filtros.monto_min || filtros.monto_max || filtros.descripcion) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-filter text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-800">Filtros aplicados:</span>
            </div>
            <button
              onClick={limpiarFiltros}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              <i className="fas fa-times mr-1"></i>
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filtros.desde && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Desde: {filtros.desde}
              </span>
            )}
            {filtros.hasta && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Hasta: {filtros.hasta}
              </span>
            )}
            {filtros.tipo && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Tipo: {filtros.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
              </span>
            )}
            {filtros.monto_min && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Min: ${filtros.monto_min}
              </span>
            )}
            {filtros.monto_max && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Max: ${filtros.monto_max}
              </span>
            )}
            {filtros.descripcion && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Descripción: {filtros.descripcion}
              </span>
            )}
          </div>
        </div>
      )}

      {balance && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Ingresos:</strong> ${balance.ingresos.toFixed(2)}</p>
          <p><strong>Egresos:</strong> ${balance.egresos.toFixed(2)}</p>
          <p><strong>Saldo:</strong> ${balance.saldo.toFixed(2)}</p>
        </div>
      )}

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id} className="border-t text-center">
              <td>{new Date(m.fecha).toLocaleString()}</td>
              <td className={m.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                {m.tipo}
              </td>
              <td>${parseFloat(m.monto).toFixed(2)}</td>
              <td>{m.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-xl font-semibold mb-4">Registrar Movimiento</h3>
        <form onSubmit={guardar} className="space-y-4">
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
}

CajaPage.layout = (page) => <Layout>{page}</Layout>;
export default CajaPage;
