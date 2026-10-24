import { useState } from "react";
import type { DatosPrestamo, Equipo, Prestamo } from "./types";
import { equiposIniciales } from "./data/equiposIniciales";
import { TITULO_APP } from "./config";
import { hoyISO } from "./utils/fechas";
import Encabezado from "./components/Encabezado";
import FormularioPrestamo from "./components/FormularioPrestamo";
import Inventario from "./pages/Inventario";
import PrestamosActivos from "./pages/PrestamosActivos";

type Vista = "inventario" | "prestamos";

export default function App() {
  const [equipos, setEquipos] = useState<Equipo[]>(equiposIniciales);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [vista, setVista] = useState<Vista>("inventario");
  const [equipoSeleccionadoId, setEquipoSeleccionadoId] = useState<number | null>(null);

  // Derivados
  const disponibles = equipos.filter((e) => e.disponible).length;
  const equipoSeleccionado = equipos.find((e) => e.id === equipoSeleccionadoId);

  function handleGuardar(datos: DatosPrestamo) {
    if (equipoSeleccionadoId === null) return;

    const nuevo: Prestamo = {
      id: prestamos.reduce((max, p) => Math.max(max, p.id), 0) + 1,
      equipoId: equipoSeleccionadoId,
      solicitante: datos.solicitante,
      carne: datos.carne,
      fechaPrestamo: hoyISO(),
      fechaLimite: datos.fechaLimite,
      devuelto: false,
      curso: datos.curso,
    };

    setPrestamos((prev) => [...prev, nuevo]);
    setEquipos((prev) =>
      prev.map((e) => (e.id === equipoSeleccionadoId ? { ...e, disponible: false } : e))
    );
    setEquipoSeleccionadoId(null);
  }

  function handleDevolver(prestamoId: number) {
    const prestamo = prestamos.find((p) => p.id === prestamoId);
    if (!prestamo) return;

    setPrestamos((prev) =>
      prev.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
    );
    setEquipos((prev) =>
      prev.map((e) => (e.id === prestamo.equipoId ? { ...e, disponible: true } : e))
    );
  }

  return (
    <>
      <Encabezado titulo={TITULO_APP} disponibles={disponibles} total={equipos.length} />

      <nav className="nav">
        <button
          className={vista === "inventario" ? "activo" : ""}
          onClick={() => setVista("inventario")}
        >
          Inventario
        </button>
        <button
          className={vista === "prestamos" ? "activo" : ""}
          onClick={() => setVista("prestamos")}
        >
          Préstamos activos
        </button>
      </nav>

      <main>
        {vista === "inventario" ? (
          <Inventario equipos={equipos} onPrestar={setEquipoSeleccionadoId} />
        ) : (
          <PrestamosActivos
            prestamos={prestamos}
            equipos={equipos}
            onDevolver={handleDevolver}
          />
        )}
      </main>

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          onGuardar={handleGuardar}
          onCancelar={() => setEquipoSeleccionadoId(null)}
        />
      )}
    </>
  );
}