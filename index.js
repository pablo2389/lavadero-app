const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // o el servicio que uses
  auth: {
    user: process.env.EMAIL_USER,  // correo desde variables de entorno
    pass: process.env.EMAIL_PASS,  // contraseña o app password
  },
});

app.use(cors()); // Permitir CORS
app.use(express.json());

// Ruta para probar el backend
app.get('/api/mensaje', (req, res) => {
  res.json({ mensaje: "Bienvenido al backend del lavadero!" });
});

// Función para enviar correo
async function enviarConfirmacion(emailCliente, nombreCliente, fechaTurno) {
  const fechaFormateada = new Date(fechaTurno).toLocaleString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailCliente,
    subject: "📅 Confirmación de turno ✔️",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hola <strong>${nombreCliente}</strong> 👋,</p>
        <p>Tu turno fue confirmado para:</p>
        <p style="font-size: 18px; font-weight: bold; color: #2e86de;">${fechaFormateada}</p>
        <p>¡Gracias por elegirnos! 😊</p>
        <p>Saludos,<br>El equipo de <strong>Lavadero</strong></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Ruta para enviar confirmación por mail
app.post('/api/enviar-confirmacion', async (req, res) => {
  try {
    const { email, nombre, fecha } = req.body;
    await enviarConfirmacion(email, nombre, fecha);
    res.status(200).json({ mensaje: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error enviando mail:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});
