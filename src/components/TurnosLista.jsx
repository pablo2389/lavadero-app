import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function TurnosLista({ telefonoFiltro, refreshTrigger = 0, onTurnosHoy }) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "turnos"), orderBy("fecha", "asc"));
      const snap = await getDocs(q);
      let lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (telefonoFiltro) lista = lista.filter(t => t.telefono === telefonoFiltro);
      setTurnos(lista);
      if (onTurnosHoy) {
  const hoy = lista.filter(t => {
    const f = new Date(t.fecha.seconds * 1000);
    return !t.atendido && f.toDateString() === new Date().toDateString();
  });
  onTurnosHoy(hoy.length);
}
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTurnos(); }, [telefonoFiltro, refreshTrigger]);

  const borrarUno = async (id) => {
    if (window.confirm("¿Borrar este turno?")) {
      await deleteDoc(doc(db, "turnos", id));
      fetchTurnos();
    }
  };

  const marcarAtendido = async (id, actual) => {
    await updateDoc(doc(db, "turnos", id), { atendido: !actual });
    fetchTurnos();
  };

  const borrarTodos = async () => {
    if (window.confirm("¿Borrar todos los turnos?")) {
      for (const t of turnos) await deleteDoc(doc(db, "turnos", t.id));
      fetchTurnos();
    }
  };

  if (loading) return <p style={{ color: "#6b7280", fontSize: 14 }}>Cargando...</p>;
  if (turnos.length === 0) return (
    <p style={{ color: "#6b7280", fontSize: 14 }}>
      No hay turnos agendados{telefonoFiltro ? " para este número" : ""}.
    </p>
  );

  const ahora = new Date();
  const hoy = turnos.filter(t => {
    const f = new Date(t.fecha.seconds * 1000);
    return !t.atendido && f.toDateString() === ahora.toDateString();
  });
  const proximos = turnos.filter(t => {
    const f = new Date(t.fecha.seconds * 1000);
    return !t.atendido && f > ahora && f.toDateString() !== ahora.toDateString();
  });
  const atendidos = turnos.filter(t => t.atendido);

  const TurnoCard = ({ id, nombre, telefono, fecha, atendido }) => (
    <div className="turno-item" style={{ opacity: atendido ? 0.5 : 1 }}>
      <div className="turno-dot" style={{ background: atendido ? "#4ade80" : "#3b82f6" }} />
      <div className="turno-info">
        <div className="turno-nombre" style={{ textDecoration: atendido ? "line-through" : "none" }}>
          {nombre}
        </div>
        <div className="turno-meta">
          {telefono} · {new Date(fecha.seconds * 1000).toLocaleString("es-AR", {
            weekday: "short", day: "numeric", month: "short",
            hour: "2-digit", minute: "2-digit"
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => marcarAtendido(id, atendido)} style={{
          background: atendido ? "#14532d" : "#166534", border: "none",
          borderRadius: 6, padding: "6px 10px", color: "#4ade80",
          cursor: "pointer", fontSize: 14, fontWeight: "bold"
        }}>
          {atendido ? "↩" : "✓"}
        </button>
        <button onClick={() => borrarUno(id)} style={{
          background: "#7f1d1d20", border: "1px solid #7f1d1d",
          borderRadius: 6, padding: "6px 10px", color: "#f87171",
          cursor: "pointer", fontSize: 14
        }}>✕</button>
      </div>
    </div>
  );

  // Vista cliente — lista simple
  if (telefonoFiltro) return (
    <div>
      {turnos.map(t => <TurnoCard key={t.id} {...t} />)}
    </div>
  );

  // Vista admin — secciones
  return (
    <div>
      {/* HOY */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#f59e0b" }}>
            Hoy
          </span>
          <span style={{ background: "#78350f", color: "#fcd34d", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            {hoy.length}
          </span>
        </div>
        {hoy.length === 0
          ? <p style={{ color: "#4b5563", fontSize: 13 }}>Sin turnos para hoy</p>
          : hoy.map(t => <TurnoCard key={t.id} {...t} />)
        }
      </div>

      {/* PRÓXIMOS */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#3b82f6" }}>
            Próximos
          </span>
          <span style={{ background: "#1e3a5f", color: "#93c5fd", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            {proximos.length}
          </span>
        </div>
        {proximos.length === 0
          ? <p style={{ color: "#4b5563", fontSize: 13 }}>Sin turnos próximos</p>
          : proximos.map(t => <TurnoCard key={t.id} {...t} />)
        }
      </div>

      {/* ATENDIDOS */}
      {atendidos.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#4ade80" }}>
              Atendidos
            </span>
            <span style={{ background: "#14532d", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
              {atendidos.length}
            </span>
          </div>
          {atendidos.map(t => <TurnoCard key={t.id} {...t} />)}
        </div>
      )}

      <button className="btn-borrar" onClick={borrarTodos}>
        Borrar todos los turnos
      </button>
    </div>
  );
}