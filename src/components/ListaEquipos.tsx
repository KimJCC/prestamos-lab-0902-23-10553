import type { Equipo } from "../types";
import TarjetaEquipo from "./TarjetaEquipo";

interface ListaEquiposProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export default function ListaEquipos({ equipos, onPrestar }: ListaEquiposProps) {
  return (
    <div className="lista">
      {equipos.map((e) => (
        <TarjetaEquipo key={e.id} equipo={e} onPrestar={onPrestar} />
      ))}
    </div>
  );
}