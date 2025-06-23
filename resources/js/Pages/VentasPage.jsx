import { useState, useEffect } from "react";
import VentaForm from "../components/ventas/VentaForm";
import axios from "axios";

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [filtros, setFiltros] = useState({ desde: "", hasta: "", producto: "" });
  const [reporte, setReporte] = useState(null);
  const [fechaReporte, setFechaReporte] = useState("");

  const fetchVentas = async () => {
    const res = await axios.get("/api/ventas");
    setVentas(res.data);
  };

  const fetchVentasFiltradas = async () => {
    const res = await axios.get("/api/ventas/filtrar", { params: filtros });
    setVentas(res.data);
  };

  const fetchReporteCaja = async () => {
    const res = await axios.get("/api/caja/reporte-diario", {
      params: { fecha: fechaReporte || undefined },
    });
    setReporte(res.data);
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Registrar Venta</h1>
      <VentaForm onVentaRealizada={fetchVentas} />

      <h2 className="text-xl font-semibold mt-10 mb-2">Filtrar Historial</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={filtros.desde}
          onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filtros.hasta}
          onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Producto"
          value={filtros.producto}
          onChange={(e) => setFiltros({ ...filtros, producto: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchVentasFiltradas}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filtrar
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Historial de Ventas</h2>
      <table className="w-full border text-left mb-8">
        <thead className="bg-gray-100">
          <tr>
            <th>Comprobante</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id} className="border-t">
              <td>{v.comprobante_externo}</td>
              <td>{new Date(v.fecha).toLocaleString()}</td>
              <td>${v.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Reporte de Caja Diario</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={fechaReporte}
          onChange={(e) => setFechaReporte(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchReporteCaja}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Consultar
        </button>
      </div>

      {reporte && (
        <div className="border p-4 rounded bg-gray-100">
          <p><strong>Fecha:</strong> {reporte.fecha}</p>
          <p><strong>Ingresos:</strong> ${reporte.ingresos}</p>
          <p><strong>Egresos:</strong> ${reporte.egresos}</p>
          <p><strong>Saldo:</strong> ${reporte.saldo}</p>
        </div>
      )}
    </div>
  );
}
