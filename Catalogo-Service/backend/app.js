fetch("https://<API_GATEWAY_URL>/catalog")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("catalog");
        data.forEach(item => {
            const div = document.createElement("div");
            div.textContent = `${item.nombre} - $${item.precio}`,
            container.appendChild(div);
        });
    });