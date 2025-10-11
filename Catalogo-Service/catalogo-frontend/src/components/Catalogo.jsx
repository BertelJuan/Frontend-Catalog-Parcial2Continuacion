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
    <div style={{ padding: "20px" }}>
      <h2>Catálogo de Productos</h2>
      <button onClick={loadCatalog}>Cargar Productos</button>

      {catalog.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
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
      )}
    </div>
  );
}