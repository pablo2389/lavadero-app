import React, { useState } from "react";

function TurnoForm({ telefono }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // Función simple para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setMensaje("Correo electrónico no válido");
      return;
    }
    if (!nombre.trim()) {
      setMensaje("Por favor ingresa el nombre");
      return;
    }
    if (!fecha.trim()) {
      setMensaje("Por favor ingresa la fecha y hora");
      return;
    }

    setLoading(true);
    setMensaje("");

    const data = { email, nombre, fecha, telefono };

    try {
      const res = await fetch("http://localhost:3000/api/enviar-confirmacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultado = await res.json();

      if (res.ok) {
        setMensaje("Turno confirmado y email enviado!");
        setEmail("");
        setNombre("");
        setFecha("");
      } else {
        setMensaje("Error: " + resultado.error);
      }
    } catch (error) {
      setMensaje("Error de red: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label>Nombre:</label><br />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label>Fecha y hora:</label><br />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Enviando..." : "Confirmar turno"}
      </button>

      {mensaje && (
        <p
          style={{
            marginTop: 15,
            color: mensaje.toLowerCase().includes("error") ? "red" : "green",
          }}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}

export default TurnoForm;
