import React, { useState, useEffect } from "react";
import { getCatalog, iniciarPagoServicio } from "../services/catalogService";

export default function Catalogo() {
  const [catalog, setCatalog] = useState([]);
  const [columns, setColumns] = useState([]);
  const [cardId, setCardId] = useState('');
  const [loadingPago, setLoadingPago] = useState(false);
  const [resultadoPago, setResultadoPago] = useState(null);

  useEffect(() => {
    const loadInitialCatalog = async () => {
      try {
        const data = await getCatalog();
        setCatalog(data);
        if (data.length > 0) {
          const filteredColumns = Object.keys(data[0]).filter(key => !['ID', 'email', 'Estado'].includes(key));
          setColumns(filteredColumns);
        }
      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        setResultadoPago({ success: false, message: `Error al cargar el catálogo: ${error.message}` });
      }
    };
    loadInitialCatalog();
  }, []);

  const handlePagar = async (servicioAPagar) => {
    if (!cardId) {
      alert('Por favor, ingresa el ID de tu tarjeta.');
      return;
    }
    
    setLoadingPago(true);
    setResultadoPago(null);

    try {
      const precioComoString = servicioAPagar["Precio Mensual"] || "0";
      const precioNumerico = parseFloat(precioComoString.replace(",", ".").replace(" US$", "").replace(/\./g, ''));

      const servicioParaEnviar = {
        id: servicioAPagar.ID,
        categoria: servicioAPagar.Categoría,
        proveedor: servicioAPagar.Proveedor,
        servicio: servicioAPagar.Servicio,
        plan: servicioAPagar.Plan,
        precio_mensual: precioNumerico,
        detalles: servicioAPagar["Velocidad/Detalles"],
        estado: servicioAPagar.Estado,
        email: "utriamiguelange1@gmail.com" // Asumo que el email es constante por ahora
      };

      const respuesta = await iniciarPagoServicio(cardId, servicioParaEnviar);
      setResultadoPago({ success: true, message: `¡Pago iniciado! ID de seguimiento: ${respuesta.traceId}` });
    } catch (error) {
      setResultadoPago({ success: false, message: `Error: ${error.message}` });
    } finally {
      setLoadingPago(false);
    }
  };

  return (
    <div className="card catalog-card">
      <h2 className="card-title">Pagar Servicios</h2>

      <div className="input-tarjeta mb-3">
        <label htmlFor="cardId" className="form-label">ID de tu Tarjeta de Pago:</label>
        <input
          type="text"
          id="cardId"
          className="form-control"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          placeholder="Ingresa el UUID de tu tarjeta"
        />
      </div>

      {resultadoPago && (
        <div className={`alert ${resultadoPago.success ? 'alert-success' : 'alert-danger'}`}>
          {resultadoPago.message}
        </div>
      )}

      {catalog.length > 0 ? (
        <div className="table-container">
          <table className="catalog-table">
            <thead>
              <tr>
                {columns.map((col) => (<th key={col}>{col}</th>))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((item) => (
                <tr key={item.ID}>
                  {columns.map((col) => (<td key={col}>{item[col]}</td>))}
                  <td>
                    <button
                      className="btn-success"
                      onClick={() => handlePagar(item)}
                      disabled={loadingPago}
                    >
                      {loadingPago ? 'Procesando...' : 'Pagar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="placeholder-text">Cargando catálogo de servicios...</p>
      )}
    </div>
  );
}