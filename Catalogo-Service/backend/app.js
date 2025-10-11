const API_URL = "https://b2s6j485m7.execute-api.us-east-1.amazonaws.com/prod/catalog"

document.getElementById("loadBtn").addEventListener("click", async () => {
    try{
        const res = await fetch(API_URL);
        const data = await res.json();

        const thead = document.querySelector("#catalogTable thead tr");
        const tbody = document.querySelector("#catalogTable tbody");

        thead.innerHTML = "";
        tbody.innerHTML = "";

        const columnas = Object.keys(data[0]);

        columnas.forEach(col => {
            const th = document.createElement("th");
            th.textContent = col;
            thead.appendChild(th);
        })
        
        data.forEach(item => {
            const tr = document.createElement("tr");
            columnas.forEach(col => {
                const td = document.createElement("td");
                td.textContent = item[col] || "-";
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error cargando catalogo: ", err);
        alert("No se pudo cargar el catalogo. Revisa la consola.");
    }
});