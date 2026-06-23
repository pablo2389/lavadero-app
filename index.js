const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando");
});

app.get("/api/mensaje", (req, res) => {
  res.json({ mensaje: "Hola desde backend en Render!" });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificamos la conexión SMTP al iniciar el servidor
transporter.verify(function(error, success) {
  if (error) {
    console.error("Error de conexión SMTP:", error);
  } else {
    console.log("Servidor SMTP listo para enviar emails");
  }
});

async function enviarConfirmacion(emailCliente, nombreCliente, fechaTurno) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailCliente,
    subject: "Confirmación de turno",
    text: `Hola ${nombreCliente}, tu turno fue confirmado para ${fechaTurno}. ¡Gracias!`,
  };

  return transporter.sendMail(mailOptions);
}

app.post("/api/enviar-confirmacion", async (req, res) => {
  const { email, nombre, fecha } = req.body;

  if (!email || !nombre || !fecha) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    await enviarConfirmacion(email, nombre, fecha);
    res.json({ mensaje: "Email de confirmación enviado" });
  } catch (error) {
    console.error("Error enviando email:", error);
    res.status(500).json({ error: "Error enviando email" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
