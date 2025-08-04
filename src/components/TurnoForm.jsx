import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function TurnoForm({ telefono }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "turnos"), {
        nombre,
        telefono,
        fecha: Timestamp.fromDate(new Date(fecha)),
      });
      alert("Turno guardado con éxito");
      setNombre("");
      setFecha("");
    } catch (error) {
      console.error("Error al guardar turno:", error);
      alert("Error guardando turno");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reservar Turno</h2>
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      <button type="submit">Guardar turno</button>
    </form>
  );
}
