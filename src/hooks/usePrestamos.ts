import { obtenerPrestamosActivos } from "../services/api";
import { useCarga } from "./useCarga";

export function usePrestamos() {
  const { datos, setDatos, cargando, error, reintentar } = useCarga(obtenerPrestamosActivos);
  return { prestamos: datos, setPrestamos: setDatos, cargando, error, reintentar };
}