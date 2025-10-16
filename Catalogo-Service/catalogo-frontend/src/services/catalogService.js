// --- URLs de tus APIs ---
// Es una buena práctica definir las URLs base en un solo lugar.
const CATALOG_API_URL = "https://b2s6j485m7.execute-api.us-east-1.amazonaws.com/prod";
const PAYMENT_API_URL = "https://dc8ic9rjxe.execute-api.us-east-1.amazonaws.com/v1";

/**
 * Obtiene la lista completa de servicios del catálogo.
 * @returns {Promise<Array>} Una lista de los servicios.
 */
export async function getCatalog() {
    try {
        const response = await fetch(`${CATALOG_API_URL}/catalog`);
        if (!response.ok) {
            // Si la respuesta no es exitosa, creamos un error con el estado.
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener el catálogo:", error);
        // Lanzamos el error de nuevo para que el componente lo atrape.
        throw error;
    }
}

/**
 * Llama al endpoint para iniciar un nuevo pago de servicio.
 * @param {string} cardId El ID de la tarjeta del usuario.
 * @param {object} service El objeto completo del servicio a pagar.
 * @returns {Promise<object>} La respuesta de la API (ej: { traceId: "..." }).
 */
export const iniciarPagoServicio = async (cardId, service) => {
    const payload = {
        cardId,
        service,
    };

    console.log("Enviando payload de pago:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${PAYMENT_API_URL}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
        // Lanzamos un error con el mensaje que nos da el backend.
        throw new Error(responseData.error || 'Ocurrió un error al iniciar el pago.');
    }

    return responseData;
};

/**
 * (FUNCIÓN AÑADIDA)
 * Consulta el estado de una transacción de pago usando su traceId.
 * @param {string} traceId El ID de la transacción a consultar.
 * @returns {Promise<object>} El objeto con el estado actual del pago.
 */
export const consultarEstadoPago = async (traceId) => {
  if (!traceId) throw new Error("Se requiere un traceId para consultar el estado.");

  const response = await fetch(`${PAYMENT_API_URL}/status/${traceId}`);
  
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || 'Error al consultar el estado del pago.');
  }

  return responseData;
};