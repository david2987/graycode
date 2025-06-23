import { useState, useEffect } from "react";
import axios from "axios";

export default function CajaPage() {
    const [movimientos, setMovimientos] = useState([]);
    const [balance, setBalance] = useState(null);
    const [tipo, setTipo] = useState("ingreso");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const fetchDatos = async () => {
        const [movRes, balRes] = await Promise.all([
            axios.get("/api/caja"),
            axios.get("/api/caja/balance"),
        ]);
        setMovimientos(movRes.data);
        setBalance(balRes.data);
    };

    const enviarMovimiento = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/caja", {
                tipo,
                monto,
                descripcion,
            });
            setMonto("");
            setDescripcion("");
            fetchDatos();
        } catch (err) {
            alert("Error al guardar: " + err.response?.data?.message);
        }
    };
    const [filtros, setFiltros] = useState({ desde: "", hasta: "", tipo: "" });

    const filtrarMovimientos = async () => {
        const res = await axios.get("/api/caja", { params: filtros });
        setMovimientos(res.data);
    };

    const resetearFiltros = () => {
        setFiltros({ desde: "", hasta: "", tipo: "" });
        fetchDatos();
    };

    useEffect(() => {
        fetchDatos();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Flujo de Caja</h1>

            <form onSubmit={enviarMovimiento} className="flex gap-4 mb-6">
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                <input
                    type="number"
                    min="0"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Monto"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    className="border p-2 rounded w-full"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Registrar
                </button>
            </form>

            <h2 className="text-xl font-semibold mb-2">Balance Actual</h2>
            {balance && (
                <div className="bg-gray-100 p-4 rounded mb-6">
                    <p>
                        <strong>Ingresos:</strong> $
                        {balance.ingresos.toFixed(2)}
                    </p>
                    <p>
                        <strong>Egresos:</strong> ${balance.egresos.toFixed(2)}
                    </p>
                    <p>
                        <strong>Saldo:</strong> ${balance.saldo.toFixed(2)}
                    </p>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-2">Filtrar Movimientos</h2>
            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    onChange={(e) =>
                        setFiltros({ ...filtros, desde: e.target.value })
                    }
                    className="border p-2 rounded"
                    value={filtros.desde}
                />
                <input
                    type="date"
                    onChange={(e) =>
                        setFiltros({ ...filtros, hasta: e.target.value })
                    }
                    className="border p-2 rounded"
                    value={filtros.hasta}
                />
                <select
                    value={filtros.tipo}
                    onChange={(e) =>
                        setFiltros({ ...filtros, tipo: e.target.value })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">Todos</option>
                    <option value="ingreso">Ingresos</option>
                    <option value="egreso">Egresos</option>
                </select>
                <button
                    onClick={filtrarMovimientos}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Filtrar
                </button>
                <button
                    onClick={resetearFiltros}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                    Limpiar
                </button>
            </div>
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
                        <tr key={m.id} className="border-t">
                            <td>{new Date(m.fecha).toLocaleString()}</td>
                            <td
                                className={
                                    m.tipo === "ingreso"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {m.tipo}
                            </td>
                            <td>${parseFloat(m.monto).toFixed(2)}</td>
                            <td>{m.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
