import React, { useState } from "react";

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
                "https://tu-api.execute-api.us-west-1.amazonaws.com/prod/catalog/update",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) throw new Error("Error al subir el archivo");

            const result = await response.json();
            setMessage(result.message || "Catalogo actualizado correctamente");
        } catch (error) {
            console.error("Error al subir: ", error);
            setMessage("Error al subir el catalogo");
        }
    }

    return (
    <div style={{ marginTop: "30px" }}>
      <h2>Actualizar Catálogo</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Subir CSV
      </button>
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.includes("Error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadCatalog;