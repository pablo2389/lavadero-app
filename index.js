const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("EMAIL_USER desde .env:", process.env.EMAIL_USER);

// Configurar nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(cors({
  origin: 'https://lavadero-appone.vercel.app',
}));

app.use(express.json());

// Ruta simple de test
app.get('/api/mensaje', (req, res) => {
  res.json({ mensaje: "Bienvenido al backend del lavadero!" });
});

// Función para enviar email
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

// Ruta POST para enviar mail
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
