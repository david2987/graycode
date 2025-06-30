import Layout from '../Components/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';

function EstadisticasPage() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('dia');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/estadisticas/getEstadisticas?periodo=${periodo}&fecha=${fecha}`);
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [periodo, fecha]);

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto || 0);
  };

  const obtenerColorFormaPago = (formaPago) => {
    const colores = {
      'efectivo': '#10B981',
      'transferencia': '#3B82F6',
      'tarjeta_debito': '#8B5CF6',
      'tarjeta_credito': '#F59E0B'
    };
    return colores[formaPago] || '#6B7280';
  };

  const obtenerNombreFormaPago = (formaPago) => {
    const nombres = {
      'efectivo': 'Efectivo',
      'transferencia': 'Transferencia',
      'tarjeta_debito': 'T. Débito',
      'tarjeta_credito': 'T. Crédito'
    };
    return nombres[formaPago] || formaPago;
  };

  const obtenerNombreMes = (mes) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || mes;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Ventas</h1>
        <div className="flex gap-4">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dia">Día</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>
          <input
            type={periodo === 'dia' ? 'date' : periodo === 'mes' ? 'month' : 'number'}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={periodo === 'año' ? '2020' : undefined}
            max={periodo === 'año' ? new Date().getFullYear() : undefined}
          />
        </div>
      </div>

      {estadisticas && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {estadisticas.resumen?.total_ventas || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i className="fas fa-dollar-sign text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monto Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatearMoneda(estadisticas.resumen?.monto_total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio por Venta</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatearMoneda(estadisticas.resumen?.promedio_venta)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Ventas por Tiempo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ventas por {periodo === 'dia' ? 'Hora' : periodo === 'mes' ? 'Día' : 'Mes'}
            </h3>
            <div className="h-64">
              {periodo === 'dia' && estadisticas.ventas_por_hora && (
                <div className="h-full flex items-end justify-between gap-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const venta = estadisticas.ventas_por_hora.find(v => v.hora === i);
                    const cantidad = venta ? venta.cantidad : 0;
                    const maxCantidad = Math.max(...estadisticas.ventas_por_hora.map(v => v.cantidad), 1);
                    const altura = (cantidad / maxCantidad) * 100;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${altura}%` }}
                          title={`${i}:00 - ${cantidad} ventas`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{i}:00</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {periodo === 'mes' && estadisticas.ventas_por_dia && (
                <div className="h-full flex items-end justify-between gap-2">
                  {estadisticas.ventas_por_dia.map((venta, index) => {
                    const maxCantidad = Math.max(...estadisticas.ventas_por_dia.map(v => v.cantidad), 1);
                    const altura = (venta.cantidad / maxCantidad) * 100;
                    const fecha = new Date(venta.dia);
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                          style={{ height: `${altura}%` }}
                          title={`${fecha.getDate()}/${fecha.getMonth() + 1} - ${venta.cantidad} ventas`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{fecha.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {periodo === 'año' && estadisticas.ventas_por_mes && (
                <div className="h-full flex items-end justify-between gap-2">
                  {estadisticas.ventas_por_mes.map((venta, index) => {
                    const maxCantidad = Math.max(...estadisticas.ventas_por_mes.map(v => v.cantidad), 1);
                    const altura = (venta.cantidad / maxCantidad) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-600"
                          style={{ height: `${altura}%` }}
                          title={`${obtenerNombreMes(venta.mes)} - ${venta.cantidad} ventas`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{obtenerNombreMes(venta.mes).substring(0, 3)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de Formas de Pago */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Forma de Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                {estadisticas.ventas_por_forma_pago && (
                  <div className="h-full flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {estadisticas.ventas_por_forma_pago.map((venta, index) => {
                        const total = estadisticas.ventas_por_forma_pago.reduce((sum, v) => sum + v.cantidad, 0);
                        const porcentaje = total > 0 ? (venta.cantidad / total) * 100 : 0;
                        const angulo = estadisticas.ventas_por_forma_pago
                          .slice(0, index)
                          .reduce((sum, v) => sum + (v.cantidad / total) * 360, 0);
                        
                        return (
                          <div
                            key={venta.forma_pago}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(${obtenerColorFormaPago(venta.forma_pago)} ${angulo}deg, ${obtenerColorFormaPago(venta.forma_pago)} ${angulo + (porcentaje * 3.6)}deg, transparent ${angulo + (porcentaje * 3.6)}deg)`
                            }}
                          ></div>
                        );
                      })}
                      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{estadisticas.resumen?.total_ventas || 0}</div>
                          <div className="text-sm text-gray-600">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {estadisticas.ventas_por_forma_pago?.map((venta) => (
                  <div key={venta.forma_pago} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: obtenerColorFormaPago(venta.forma_pago) }}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {obtenerNombreFormaPago(venta.forma_pago)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{venta.cantidad}</div>
                      <div className="text-sm text-gray-600">{formatearMoneda(venta.total_ventas)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

EstadisticasPage.layout = (page) => <Layout>{page}</Layout>;
export default EstadisticasPage; 