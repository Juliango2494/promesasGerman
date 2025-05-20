const nodemailer = require('nodemailer');
const readline = require('readline');

// Configura readline para leer desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configura tu transporte SMTP (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com',
    pass: 'tu_contraseña_o_token'
  }
});

// Lista de destinatarios
const destinatarios = [
  'correo1@ejemplo.com',
  'correo2@ejemplo.com',
  'correo3@ejemplo.com'
];

// Pregunta el mensaje al usuario
rl.question('¿Cuál es el mensaje que deseas enviar?: ', async (mensaje) => {
  try {
    // Crea un array de promesas, una por cada destinatario
    const envios = destinatarios.map((correo) => {
      return transporter.sendMail({
        from: '"Taller JS" <tucorreo@gmail.com>',
        to: correo,
        subject: 'Correo Masivo desde Node.js',
        text: mensaje
      });
    });

    // Espera que todos se envíen al mismo tiempo
    const resultados = await Promise.all(envios);

    console.log(`✅ Correos enviados exitosamente a ${resultados.length} destinatarios.`);
  } catch (error) {
    console.error('❌ Error al enviar correos:', error);
  } finally {
    rl.close();
  }
});