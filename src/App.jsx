import React, { useState, useEffect } from "react";
import TurnoForm from "./components/TurnoForm";
import TurnosLista from "./components/TurnosLista";

function App() {
  const [telefono, setTelefono] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [mostrarTurnos, setMostrarTurnos] = useState(true);
  const [mensajeBackend, setMensajeBackend] = useState("");
  const [modo, setModo] = useState(null); // 'cliente' | 'admin'

  // Estados movidos al nivel superior (NO dentro de if)
  const [inputTelefono, setInputTelefono] = useState("");
  const [inputClave, setInputClave] = useState("");

  const ADMIN_CLAVE = "1234";

  useEffect(() => {
    fetch("https://lavadero-backend-e4zm.onrender.com/api/mensaje")
      .then((res) => res.json())
      .then((data) => setMensajeBackend(data.mensaje))
      .catch((err) => console.error("Error al traer mensaje del backend:", err));
  }, []);

  const handleContinuarCliente = () => {
    if (inputTelefono.trim() !== "") {
      setTelefono(inputTelefono);
      setLogueado(true);
      setModo("cliente");
    } else {
      alert("Por favor ingresá un teléfono válido");
    }
  };

  const handleContinuarAdmin = () => {
    if (inputClave === ADMIN_CLAVE) {
      setLogueado(true);
      setModo("admin");
      setTelefono("");
    } else {
      alert("Clave incorrecta");
    }
  };

  const handleSalir = () => {
    setTelefono("");
    setLogueado(false);
    setModo(null);
    setInputTelefono("");
    setInputClave("");
  };

  const toggleMostrarTurnos = () => {
    setMostrarTurnos(!mostrarTurnos);
  };

  if (!modo) {
    // Pantalla inicial para elegir modo
    return (
      <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
        <h2>¿Querés entrar como cliente o administrador?</h2>

        <div style={{ marginBottom: 20 }}>
          <h3>Cliente</h3>
          <input
            type="tel"
            placeholder="Ej: 2611234567"
            value={inputTelefono}
            onChange={(e) => setInputTelefono(e.target.value)}
            style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 10 }}
          />
          <button
            onClick={handleContinuarCliente}
            style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
          >
            Continuar como Cliente
          </button>
        </div>

        <div>
          <h3>Administrador</h3>
          <input
            type="password"
            placeholder="Clave de administrador"
            value={inputClave}
            onChange={(e) => setInputClave(e.target.value)}
            style={{ width: "100%", padding: 10, fontSize: 16, marginBottom: 10 }}
          />
          <button
            onClick={handleContinuarAdmin}
            style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
          >
            Entrar como Admin
          </button>
        </div>
      </div>
    );
  }

  // Vistas para cliente o admin ya logueado
  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <p style={{ fontStyle: "italic", color: "#555" }}>{mensajeBackend}</p>

      <button
        onClick={handleSalir}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
          backgroundColor: "#999",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        Cerrar sesión
      </button>

      {modo === "cliente" && (
        <>
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
        </>
      )}

      {modo === "admin" && (
        <>
          <h1 style={{ fontSize: 24, marginBottom: 15 }}>Panel de administrador</h1>
          {/* En admin mostramos todos los turnos, sin filtro */}
          <TurnosLista telefonoFiltro={null} />
        </>
      )}
    </div>
  );
}

export default App;
