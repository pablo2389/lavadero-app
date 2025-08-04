import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function TurnosLista() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTurnos() {
      const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));
      const querySnapshot = await getDocs(q);
      const listaTurnos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTurnos(listaTurnos);
      setLoading(false);
    }

    fetchTurnos();
  }, []);

  if (loading) return <p>Cargando turnos...</p>;
  if (turnos.length === 0) return <p>No hay turnos agendados.</p>;

  return (
    <div>
      <h2>Turnos Agendados</h2>
      <ul>
        {turnos.map(({ id, nombre, fecha }) => (
          <li key={id}>
            <strong>{nombre}</strong> - {new Date(fecha.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
