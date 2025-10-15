import React, { useState } from "react";
import { getCatalog } from "../services/catalogService";

export default function Catalogo() {
    const [catalog, setCatalog] = useState([]);
    const [columns, setColums] = useState([]);

    const loadCatalog = async () => {
        const data = await getCatalog();
        setCatalog(data);
        if (data.length > 0) setColums(Object.keys(data[0]));
    };

   return (
    <div className="card catalog-card">
      <h2 className="card-title">Catálogo de Productos</h2>
      <button className="btn-primary mb-2" onClick={loadCatalog}>
        Cargar Productos
      </button>

      {catalog.length > 0 ? (
        <div className="table-container">
          <table className="catalog-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalog.map((item, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{item[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="placeholder-text">
          No hay datos cargados aún. Haz clic en “Cargar Productos”.
        </p>
      )}
    </div>
  );
}