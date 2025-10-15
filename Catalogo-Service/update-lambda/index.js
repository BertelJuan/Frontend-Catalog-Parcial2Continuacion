const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const Busboy = require("busboy");
const Redis = require("ioredis");
const xlsx = require("xlsx");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    connectTimeout: 10000
});

exports.handler = async (event) => {
  try {

    console.log("Iniciando carga del archivo...");

    await redis.set("lambda-test", "ok");
    const test = await redis.get("lambda-test");
    console.log("Conexión Redis OK:", test);

    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return {
        statusCode: 400,
        body: "El tipo de contenido debe ser multipart/form-data",
      };
    }

    // Parsear el archivo desde el form-data usando Busboy
    const result = await parseFormData(event, contentType);

    if (!result.file) {
      return { statusCode: 400, body: "Archivo no recibido correctamente" };
    }

    // Subir el archivo al bucket S3
    await s3.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.FILE_KEY,
        Body: result.file,
      }).promise();
      
      console.log("Archivo subido a S3 correctamente");

    const workbook = xlsx.read(result.file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    await redis.del("productos_cache");
    console.log("Cache anterior eliminado.");
    
    await redis.set("productos_cache", JSON.stringify(data));
    console.log("Redis actualizado con nuevo catalogo.");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Catalogo actualizado exitosamente." }),
    };
  } catch (err) {
    console.error("Error en actualizacion:", err);
    return { statusCode: 500, body: "Error en actualizacion del catalogo." };
  }
};

// --- Función auxiliar para procesar multipart/form-data ---
function parseFormData(event, contentType) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: { "content-type": contentType } });
    const result = {};
    let fileBuffer = Buffer.alloc(0);
    let filename = "";

    busboy.on("file", (fieldname, file, info) => {
      filename = info.filename;
      file.on("data", (data) => {
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });
    });

    busboy.on("close", () => {
      result.file = fileBuffer;
      result.filename = filename;
      resolve(result);
    });

    busboy.on("error", (err) => reject(err));

    // AWS Lambda envía el cuerpo como base64 si es binario
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;

    busboy.end(body);
  });
}
