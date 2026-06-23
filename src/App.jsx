import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import TurnoForm from "./components/TurnoForm";
import TurnosLista from "./components/TurnosLista";
import { db } from "./firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Bebas+Neue&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #e8e8e8; font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app-wrapper { min-height: 100vh; background: linear-gradient(135deg, #0a0a0a 0%, #111827 100%); }
  .header { border-bottom: 1px solid #1f2937; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; color: #fff; }
  .logo span { color: #3b82f6; }
  .btn-salir { background: transparent; border: 1px solid #374151; color: #9ca3af; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s; }
  .btn-salir:hover { border-color: #6b7280; color: #e8e8e8; }
  .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
  .login-card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; max-width: 480px; margin: 0 auto; }
  @media (min-width: 768px) {
    .cliente-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
    .container { padding: 40px 48px; }
  }
  @media (min-width: 1024px) { .container { padding: 40px 64px; } }
  .login-hero { background: linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 100%); padding: 40px 32px; text-align: center; }
  .login-hero h1 { font-family: 'Bebas Neue', sans-serif; font-size: 48px; letter-spacing: 4px; color: #fff; line-height: 1; }
  .login-hero p { color: #93c5fd; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
  .login-body { padding: 32px; }
  .tab-row { display: flex; gap: 8px; margin-bottom: 28px; background: #0a0a0a; border-radius: 10px; padding: 4px; }
  .tab { flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s; background: transparent; color: #6b7280; }
  .tab.active { background: #1f2937; color: #fff; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
  .field input { width: 100%; background: #0a0a0a; border: 1px solid #1f2937; border-radius: 10px; padding: 12px 14px; color: #e8e8e8; font-size: 15px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; }
  .field input:focus { border-color: #3b82f6; }
  .field input::placeholder { color: #374151; }
  .btn-primary { width: 100%; padding: 14px; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
  .btn-primary:hover { background: #2563eb; }
  .btn-whatsapp { width: 100%; padding: 14px; background: #16a34a; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.2s; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-whatsapp:hover { background: #15803d; }
  .btn-whatsapp:disabled { background: #1f2937; color: #4b5563; cursor: not-allowed; }
  .welcome-bar { padding: 24px 0; border-bottom: 1px solid #1f2937; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .welcome-bar h2 { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 2px; color: #fff; }
  .welcome-bar p { color: #6b7280; font-size: 13px; margin-top: 2px; }
  .counter-badge { background: #1e3a5f; border: 1px solid #1d4ed8; border-radius: 10px; padding: 10px 18px; text-align: center; }
  .counter-badge .num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #93c5fd; line-height: 1; }
  .counter-badge .label { font-size: 10px; color: #6b7280; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
  .section { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 28px; margin-bottom: 16px; }
  .section-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #3b82f6; margin-bottom: 20px; }
  .msg-ok { color: #4ade80; font-size: 14px; margin-top: 12px; }
  .msg-err { color: #f87171; font-size: 14px; margin-top: 12px; }
  .btn-toggle { width: 100%; padding: 12px; background: transparent; border: 1px solid #1f2937; color: #9ca3af; border-radius: 10px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s; margin-bottom: 16px; }
  .btn-toggle:hover { border-color: #374151; color: #e8e8e8; }
  .turno-item { background: #0a0a0a; border: 1px solid #1f2937; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
  .turno-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; flex-shrink: 0; }
  .turno-info { flex: 1; }
  .turno-nombre { font-weight: 500; font-size: 14px; color: #e8e8e8; }
  .turno-meta { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .btn-borrar { width: 100%; padding: 12px; background: transparent; border: 1px solid #7f1d1d; color: #f87171; border-radius: 10px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s; margin-top: 16px; }
  .btn-borrar:hover { background: #7f1d1d20; }
  .badge-admin { display: inline-block; background: #1e3a5f; color: #93c5fd; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-left: 10px; }
  .config-box { background: #0a0a0a; border: 1px solid #1f2937; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
  .config-row { display: flex; gap: 8px; align-items: center; }
  .config-row input { flex: 1; background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 10px 12px; color: #e8e8e8; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; }
  .config-row input:focus { border-color: #3b82f6; }
  .btn-save { padding: 10px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; white-space: nowrap; }
  .btn-save:hover { background: #2563eb; }
`;

function App() {
  const [telefono, setTelefono] = useState("");
  const [modo, setModo] = useState(null);
  const [mostrarTurnos, setMostrarTurnos] = useState(true);
  const [inputTelefono, setInputTelefono] = useState("");
  const [inputClave, setInputClave] = useState("");
  const [tab, setTab] = useState("cliente");
  const [refresh, setRefresh] = useState(0);
  const [turnosHoy, setTurnosHoy] = useState(0);
  const [adminWsp, setAdminWsp] = useState("");
  const [inputWsp, setInputWsp] = useState("");
  const [nombreLavadero, setNombreLavadero] = useState("LAVA.APP");
  const [inputNombre, setInputNombre] = useState("");

  const ADMIN_CLAVE = "lavadero2026";

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "config", "admin"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.whatsapp) setAdminWsp(data.whatsapp);
          if (data.nombreLavadero) setNombreLavadero(data.nombreLavadero);
        }
      } catch (e) { console.error(e); }
    };
    cargarConfig();
  }, []);

  const guardarConfig = async () => {
    try {
      await setDoc(doc(db, "config", "admin"), {
        whatsapp: inputWsp || adminWsp,
        nombreLavadero: inputNombre || nombreLavadero,
      });
      if (inputWsp) setAdminWsp(inputWsp);
      if (inputNombre) setNombreLavadero(inputNombre);
      setInputWsp("");
      setInputNombre("");
      alert("✅ Configuración guardada");
    } catch (e) { alert("Error al guardar"); }
  };

  const handleContinuarCliente = () => {
    if (inputTelefono.trim() !== "") {
      setTelefono(inputTelefono.trim());
      setModo("cliente");
    } else {
      alert("Ingresá un número de teléfono válido");
    }
  };

  const handleContinuarAdmin = () => {
    if (inputClave === ADMIN_CLAVE) {
      setModo("admin");
    } else {
      alert("Clave incorrecta");
    }
  };

  const handleSalir = () => {
    setModo(null);
    setTelefono("");
    setInputTelefono("");
    setInputClave("");
    setTab("cliente");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrapper">
        <div className="header">
          <div className="logo">
            {nombreLavadero.includes(".") ? (
              <>
                {nombreLavadero.split(".")[0]}<span>.</span>{nombreLavadero.split(".").slice(1).join(".")}
              </>
            ) : nombreLavadero}
          </div>
          {modo && <button className="btn-salir" onClick={handleSalir}>Cerrar sesión</button>}
        </div>

        <div className="container">
          {!modo && (
            <div className="login-card">
              <div className="login-hero">
                <h1>TURNOS</h1>
                <p>Lavadero de autos</p>
              </div>
              <div className="login-body">
                <div className="tab-row">
                  <button className={`tab ${tab === "cliente" ? "active" : ""}`} onClick={() => setTab("cliente")}>Cliente</button>
                  <button className={`tab ${tab === "admin" ? "active" : ""}`} onClick={() => setTab("admin")}>Administrador</button>
                </div>
                {tab === "cliente" && (
                  <>
                    <div className="field">
                      <label>Tu número de WhatsApp</label>
                      <input type="tel" placeholder="Ej: 2616123456" value={inputTelefono}
                        onChange={(e) => setInputTelefono(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleContinuarCliente()} />
                    </div>
                    <button className="btn-primary" onClick={handleContinuarCliente}>Reservar turno →</button>
                  </>
                )}
                {tab === "admin" && (
                  <>
                    <div className="field">
                      <label>Clave de acceso</label>
                      <input type="password" placeholder="••••••••" value={inputClave}
                        onChange={(e) => setInputClave(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleContinuarAdmin()} />
                    </div>
                    <button className="btn-primary" onClick={handleContinuarAdmin}>Entrar al panel →</button>
                  </>
                )}
              </div>
            </div>
          )}

          {modo === "cliente" && (
            <>
            <div className="welcome-bar">
                <div>
                  <h2>Hola 👋</h2>
                  <p>{telefono}</p>
                </div>
                <button className="btn-salir" onClick={handleSalir}>
                  Cambiar número
                </button>
              </div>
              <div className="cliente-grid">
                <div className="section">
                  <div className="section-title">Nuevo turno</div>
                  <TurnoForm telefono={telefono} adminWsp={adminWsp} onTurnoConfirmado={() => setRefresh(r => r + 1)} />
                </div>
                <div>
                  <button className="btn-toggle" onClick={() => setMostrarTurnos(!mostrarTurnos)}>
                    {mostrarTurnos ? "Ocultar mis turnos" : "Ver mis turnos"}
                  </button>
                  {mostrarTurnos && (
                    <div className="section">
                      <div className="section-title">Mis turnos</div>
                      <TurnosLista telefonoFiltro={telefono} refreshTrigger={refresh} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {modo === "admin" && (
            <>
              <div className="welcome-bar">
                <div>
                  <h2>Panel <span className="badge-admin">Admin</span></h2>
                  <p>Gestión de turnos</p>
                </div>
                <div className="counter-badge">
                  <div className="num">{turnosHoy}</div>
                  <div className="label">Turnos hoy</div>
                </div>
              </div>

              <div className="section" style={{ marginBottom: 16 }}>
                <div className="section-title">Configuración</div>
                <div className="config-box">
                  <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Nombre del lavadero</p>
                  <div className="config-row" style={{ marginBottom: 12 }}>
                    <input type="text" placeholder={nombreLavadero} value={inputNombre}
                      onChange={(e) => setInputNombre(e.target.value)} />
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>WhatsApp admin (recibe avisos de nuevos turnos)</p>
                  <div className="config-row">
                    <input type="tel" placeholder={adminWsp || "Ej: 2616123456"} value={inputWsp}
                      onChange={(e) => setInputWsp(e.target.value)} />
                    <button className="btn-save" onClick={guardarConfig}>Guardar</button>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">Todos los turnos</div>
                <TurnosLista
                  telefonoFiltro={null}
                  refreshTrigger={refresh}
                  onTurnosHoy={setTurnosHoy}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;