require('dotenv').config();
const readline = require('readline');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función que genera el resumen usando la API
async function generarResumen(texto) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente que resume textos." },
        { role: "user", content: `Resume el siguiente texto:\n\n${texto}` }
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const resumen = response.choices[0].message.content.trim();
    return resumen;
  } catch (error) {
    throw new Error("Error al comunicarse con la IA: " + error.message);
  }
}

// Leer texto desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Introduce el texto que deseas resumir:\n', (texto) => {
  console.log('Solicitando resumen a la IA...');

  generarResumen(texto)
    .then((resumen) => {
      console.log('\n✅ Resumen generado:');
      console.log(resumen);
    })
    .catch((error) => {
      console.error('\n❌', error.message);
    })
    .finally(() => {
      rl.close();
    });
});
