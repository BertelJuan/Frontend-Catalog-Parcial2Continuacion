const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const xlsx = require("xlsx");
const redis = require("redis");

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: 6379
    }
});

let redisConnected = false;

exports.handler = async (event) => {

    try {
        if (!redisConnected) {
            await client.connect();
            redisConnected = true;
        }
        
        const cacheKey = "productos_cache";
        const cachedData = await client.get(cacheKey);
        
        if (cachedData) {
            console.log("✅ Cache encontrado en Redis");
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: cachedData
            };
        }

        console.log("⚙️ Cache vacio, leyendo de S3...");
        const file = await s3.getObject({
            Bucket: process.env.BUCKET_NAME,
            Key: process.env.FILE_KEY
        }).promise();

        const workbook = xlsx.read(file.Body);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        await client.set(cacheKey, JSON.stringify(data), { EX: 3600 });
        console.log("Datos guardados en Redis");

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Error procesando archivo o Redis: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error procesando archivo Excel o Redis" })
        };
    } finally {
        await client.quit();
        redisConnected = false;
    }
};