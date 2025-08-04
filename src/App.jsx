import React, { useState, useEffect } from "react";
import TurnoForm from "./components/TurnoForm";
import TurnosLista from "./components/TurnosLista";

function App() {
  const [telefono, setTelefono] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [mostrarTurnos, setMostrarTurnos] = useState(true);
  const [mensajeBackend, setMensajeBackend] = useState("");

  useEffect(() => {
    fetch("https://lavadero-backend-e4zm.onrender.com/")
      .then((res) => res.json())
      .then((data) => setMensajeBackend(data.mensaje))
      .catch((err) => console.error("Error al traer mensaje del backend:", err));
  }, []);

  const handleContinuar = () => {
    if (telefono.trim() !== "") {
      setLogueado(true);
    } else {
      alert("Por favor ingresá un teléfono válido");
    }
  };

  const handleSalir = () => {
    setTelefono("");
    setLogueado(false);
  };

  const toggleMostrarTurnos = () => {
    setMostrarTurnos(!mostrarTurnos);
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      {!logueado ? (
        <>
          <h2 style={{ marginBottom: 20 }}>Ingresá tu teléfono para continuar</h2>
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 15, boxSizing: "border-box" }}
          />
          <button onClick={handleContinuar} style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}>
            Continuar
          </button>
        </>
      ) : (
        <>
          {/* Mensaje desde backend */}
          <p style={{ fontStyle: "italic", color: "#555" }}>{mensajeBackend}</p>

          <h1 style={{ fontSize: 24, marginBottom: 15 }}>Bienvenido: {telefono}</h1>

          <TurnoForm telefono={telefono} />

          <button
            onClick={toggleMostrarTurnos}
            style={{
              marginTop: 30,
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
              backgroundColor: mostrarTurnos ? "#f44336" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 5,
            }}
          >
            {mostrarTurnos ? "Ocultar historial de turnos" : "Mostrar historial de turnos"}
          </button>

          {mostrarTurnos && (
            <div style={{ marginTop: 20 }}>
              <TurnosLista telefonoFiltro={telefono} />
            </div>
          )}

          <button
            onClick={handleSalir}
            style={{
              marginTop: 30,
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
              backgroundColor: "#999",
              color: "white",
              border: "none",
              borderRadius: 5,
            }}
          >
            Cambiar usuario
          </button>
        </>
      )}
    </div>
  );
}

export default App;
