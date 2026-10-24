import type { Equipo } from "../types";

interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (id: number) => void;
}

export default function TarjetaEquipo({ equipo, onPrestar }: TarjetaEquipoProps) {
  return (
    <div className="tarjeta">
      <h3>{equipo.nombre}</h3>
      <p>{equipo.categoria}</p>
      <span className={equipo.disponible ? "etiqueta verde" : "etiqueta roja"}>
        {equipo.disponible ? "Disponible" : "Prestado"}
      </span>
      <button disabled={!equipo.disponible} onClick={() => onPrestar(equipo.id)}>
        Prestar
      </button>
    </div>
  );
}