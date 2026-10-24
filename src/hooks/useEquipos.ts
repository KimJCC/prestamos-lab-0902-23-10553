import { obtenerEquipos } from "../services/api";
import { useCarga } from "./useCarga";

export function useEquipos() {
  const { datos, setDatos, cargando, error, reintentar } = useCarga(obtenerEquipos);
  return { equipos: datos, setEquipos: setDatos, cargando, error, reintentar };
}