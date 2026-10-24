import type { Equipo, Prestamo } from "../types";
import { hoyISO } from "../utils/fechas";

interface PrestamosActivosProps {
  prestamos: Prestamo[];
  equipos: Equipo[];
  devolviendoId: number | null;   // nuevo
  onDevolver: (prestamoId: number) => void;
}

export default function PrestamosActivos({
  prestamos,
  equipos,
  onDevolver,
}: PrestamosActivosProps) {
  const hoy = hoyISO();
  const activos = prestamos.filter((p) => !p.devuelto);

  if (activos.length === 0) {
    return <p>No hay préstamos activos.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Equipo</th>
          <th>Solicitante</th>
          <th>Fecha límite</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {activos.map((p) => {
          const equipo = equipos.find((e) => e.id === p.equipoId);
          const vencido = p.fechaLimite < hoy;
          return (
            <tr key={p.id} className={vencido ? "vencido" : ""}>
              <td>
                {equipo?.nombre ?? "Equipo desconocido"}
                {p.curso && <small> (Curso: {p.curso})</small>}
              </td>
              <td>{p.solicitante}</td>
              <td>{p.fechaLimite}{vencido && " — VENCIDO"}</td>
              <td>
                <button onClick={() => onDevolver(p.id)}>Devolver</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}