import React from "react";

export function EnviarTurno() {
  async function enviarTurno() {
    const data = {
      email: "cliente@ejemplo.com",
      nombre: "Juan Pérez",
      fecha: "2025-08-04 15:30",
    };

    try {
      const res = await fetch("http://localhost:3000/api/enviar-confirmacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resultado = await res.json();

      if (res.ok) {
        console.log("Éxito:", resultado.mensaje);
      } else {
        console.error("Error:", resultado.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  return (
    <div>
      <button onClick={enviarTurno}>Enviar turno</button>
    </div>
  );
}
