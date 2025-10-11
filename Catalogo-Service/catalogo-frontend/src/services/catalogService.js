const API_URL = "https://b2s6j485m7.execute-api.us-east-1.amazonaws.com/prod/catalog";

export async function getCatalog() {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error("Error al obtener el catalogo");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}