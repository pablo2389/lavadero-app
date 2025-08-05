import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function TurnosLista({ telefonoFiltro }) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));
    const querySnapshot = await getDocs(q);

    let listaTurnos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (telefonoFiltro) {
      listaTurnos = listaTurnos.filter(turno => turno.telefono === telefonoFiltro);
    }

    setTurnos(listaTurnos);
    setLoading(false);
  };

  useEffect(() => {
    fetchTurnos();
  }, [telefonoFiltro]);

  const borrarHistorial = async () => {
    if (window.confirm("¿Estás seguro de borrar todos los turnos?")) {
      for (const turno of turnos) {
        await deleteDoc(doc(db, "turnos", turno.id));
      }
      fetchTurnos();
    }
  };

  if (loading) return <p>Cargando turnos...</p>;
  if (turnos.length === 0) return <p>No hay turnos agendados{telefonoFiltro ? " para este número." : "."}</p>;

  return (
    <div>
      <h2>Turnos Agendados {telefonoFiltro ? `(Cliente: ${telefonoFiltro})` : "(Todos)"}</h2>
      <ul>
        {turnos.map(({ id, nombre, telefono, fecha }) => (
          <li key={id}>
            <strong>{nombre}</strong> - {telefono} - {new Date(fecha.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>

      <button
        onClick={borrarHistorial}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
          backgroundColor: "#e53935",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        Borrar historial de turnos
      </button>
    </div>
  );
}
