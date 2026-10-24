import { useEffect, useState } from "react";

export function useCarga<T>(cargar: () => Promise<T[]>) {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false; // evita actualizar estado si el componente ya se desmontó

    setCargando(true);
    setError(null);

    cargar()
      .then((resultado) => {
        if (!cancelado) setDatos(resultado);
      })
      .catch(() => {
        if (!cancelado) {
          setError("No se pudo conectar con el servidor. Verifique que la API esté encendida.");
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [cargar, intento]); // arreglo de dependencias: se ejecuta al montar y al reintentar

  function reintentar() {
    setIntento((n) => n + 1);
  }

  return { datos, setDatos, cargando, error, reintentar };
}