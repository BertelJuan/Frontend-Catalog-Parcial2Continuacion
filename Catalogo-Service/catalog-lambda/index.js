const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const xlsx = require("xlsx");

exports.handler = async (event) => {
    const params = {
        Bucket: "catalogo-datos-bucket",
        Key: "productos.xlsx"
    };

    try {
        
        const file = await s3.getObject(params).promise();
        const workbook = xlsx.read(file.Body);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
    
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error procesando archivo: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error procesando archivo Excel"})
        };
    }
};