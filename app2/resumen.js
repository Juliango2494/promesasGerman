require('dotenv').config();
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import the Gemini library

async function generarResumen(texto) {
  try {
    // Initialize Gemini Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the Gemini model

    const prompt = `Resume el siguiente texto en menos de 100 palabras:\n\n${texto}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resumen = response.text();

    if (!resumen) {
      throw new Error("La respuesta de la API de Gemini no contiene un resumen válido.");
    }

    return resumen.trim();
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with an error (for axios errors, if you were using it directly)
      console.error('Error de la API:', error.response.status, error.response.data);
      throw new Error(`Error en la API (${error.response.status}): ${error.response.data.error?.message || 'Sin detalles'}`);
    } else if (error.message.includes("API key not valid")) {
        throw new Error("Tu clave de API de Gemini no es válida. Asegúrate de que esté configurada correctamente en el archivo .env.");
    }
    else {
      // Something else went wrong
      throw new Error("Error al procesar la solicitud con Gemini: " + error.message);
    }
  }
}

// Leer texto desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Introduce el texto que deseas resumir:\n', (texto) => {
  console.log('Solicitando resumen a la IA de Gemini...');

  generarResumen(texto)
    .then((resumen) => {
      console.log('\n✅ Resumen generado:');
      console.log(resumen);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message);
    })
    .finally(() => {
      rl.close();
    });
});
