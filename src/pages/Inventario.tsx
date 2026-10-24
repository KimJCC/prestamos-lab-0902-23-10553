import { useState } from "react";
import type { Equipo } from "../types";
import ListaEquipos from "../components/ListaEquipos";

interface InventarioProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export default function Inventario({ equipos, onPrestar }: InventarioProps) {
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Valores derivados: no se guardan en estado
  const categorias = Array.from(new Set(equipos.map((e) => e.categoria)));

  const filtrados = equipos.filter(
    (e) =>
      (categoria === "" || e.categoria === categoria) &&
      e.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <>
      <div className="filtros">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {filtrados.length === 0 ? (
        <p>No hay equipos que coincidan con la búsqueda.</p>
      ) : (
        <ListaEquipos equipos={filtrados} onPrestar={onPrestar} />
      )}
    </>
  );
}