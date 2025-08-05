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
    `
  };

  return transporter.sendMail(mailOptions);
}
