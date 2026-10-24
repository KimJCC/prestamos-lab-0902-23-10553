import { useState } from "react";
import type { DatosPrestamo } from "./types";
import { TITULO_APP } from "./config";
import { hoyISO } from "./utils/fechas";
import { useEquipos } from "./hooks/useEquipos";
import { usePrestamos } from "./hooks/usePrestamos";
import { actualizarDisponibilidad, crearPrestamo, marcarDevuelto } from "./services/api";
import Encabezado from "./components/Encabezado";
import FormularioPrestamo from "./components/FormularioPrestamo";
import Inventario from "./pages/Inventario";
import PrestamosActivos from "./pages/PrestamosActivos";

type Vista = "inventario" | "prestamos";

export default function App() {
  const eq = useEquipos();
  const pr = usePrestamos();

  const [vista, setVista] = useState<Vista>("inventario");
  const [equipoSeleccionadoId, setEquipoSeleccionadoId] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [devolviendoId, setDevolviendoId] = useState<number | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const cargando = eq.cargando || pr.cargando;
  const error = eq.error ?? pr.error;

  const disponibles = eq.equipos.filter((e) => e.disponible).length;
  const equipoSeleccionado = eq.equipos.find((e) => e.id === equipoSeleccionadoId);

  function reintentarTodo() {
    eq.reintentar();
    pr.reintentar();
  }

  function abrirFormulario(id: number) {
    setErrorEnvio(null);
    setEquipoSeleccionadoId(id);
  }

  async function handleGuardar(datos: DatosPrestamo) {
    if (!equipoSeleccionado || enviando) return;

    setEnviando(true);
    setErrorEnvio(null);
    try {
      const nuevo = await crearPrestamo({
        equipoId: equipoSeleccionado.id,
        solicitante: datos.solicitante,
        carne: datos.carne,
        fechaPrestamo: hoyISO(),
        fechaLimite: datos.fechaLimite,
        devuelto: false,
        curso: datos.curso,
      });
      await actualizarDisponibilidad(equipoSeleccionado.id, false);

      // La API ya guardó: ahora se actualiza la interfaz (inmutable)
      pr.setPrestamos((prev) => [...prev, nuevo]);
      eq.setEquipos((prev) =>
        prev.map((e) => (e.id === equipoSeleccionado.id ? { ...e, disponible: false } : e))
      );
      setEquipoSeleccionadoId(null);
    } catch {
      setErrorEnvio("No se pudo registrar el préstamo. Intente de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleDevolver(prestamoId: number) {
    const prestamo = pr.prestamos.find((p) => p.id === prestamoId);
    if (!prestamo || devolviendoId !== null) return;

    setDevolviendoId(prestamoId);
    setErrorAccion(null);
    try {
      await marcarDevuelto(prestamoId);
      await actualizarDisponibilidad(prestamo.equipoId, true);

      pr.setPrestamos((prev) =>
        prev.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
      );
      eq.setEquipos((prev) =>
        prev.map((e) => (e.id === prestamo.equipoId ? { ...e, disponible: true } : e))
      );
    } catch {
      setErrorAccion("No se pudo registrar la devolución. Intente de nuevo.");
    } finally {
      setDevolviendoId(null);
    }
  }

  function renderContenido() {
    if (cargando) return <p>Cargando datos...</p>;

    if (error) {
      return (
        <div className="error-api">
          <p>{error}</p>
          <button onClick={reintentarTodo}>Reintentar</button>
        </div>
      );
    }

    return vista === "inventario" ? (
      <Inventario equipos={eq.equipos} onPrestar={abrirFormulario} />
    ) : (
      <>
        {errorAccion && <p className="error">{errorAccion}</p>}
        <PrestamosActivos
          prestamos={pr.prestamos}
          equipos={eq.equipos}
          devolviendoId={devolviendoId}
          onDevolver={handleDevolver}
        />
      </>
    );
  }

  return (
    <>
      <Encabezado titulo={TITULO_APP} disponibles={disponibles} total={eq.equipos.length} />

      <nav className="nav">
        <button className={vista === "inventario" ? "activo" : ""} onClick={() => setVista("inventario")}>
          Inventario
        </button>
        <button className={vista === "prestamos" ? "activo" : ""} onClick={() => setVista("prestamos")}>
          Préstamos activos
        </button>
      </nav>

      <main>{renderContenido()}</main>

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          enviando={enviando}
          errorEnvio={errorEnvio}
          onGuardar={handleGuardar}
          onCancelar={() => setEquipoSeleccionadoId(null)}
        />
      )}
    </>
  );
}