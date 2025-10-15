import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

function UploadCatalog() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Selecciona un archivo CSV antes de subirlo");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                "https://b2s6j485m7.execute-api.us-east-1.amazonaws.com/prod/catalog/update",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) throw new Error("Error al subir el archivo");

            const result = await response.json();
            setMessage(result.message || "Catalogo actualizado correctamente");
            toast.success("Catalogo actualizado correctamente");
        } catch (error) {
            console.error("Error al subir: ", error);
            setMessage("Error al subir el catalogo");
        }
    }

    return (
    <div className="card upload-card">
      <h2 className="card-title">Actualizar Catálogo</h2>

      <div className="upload-group">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleUpload} className="btn-primary">
          Subir Archivo
        </button>
      </div>

      {message && (
        <p
          className={`upload-message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </p>
      )}
      <ToastContainer />
    </div>
  );
}

export default UploadCatalog;