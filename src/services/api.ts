import type { Equipo, Prestamo } from "../types";

const API_URL = import.meta.env.VITE_API_URL as string;

export type NuevoPrestamo = Omit<Prestamo, "id">;

async function peticion<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });

  // fetch NO lanza error con 404 o 500: hay que revisarlo a mano
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con el código ${respuesta.status}`);
  }
  return respuesta.json() as Promise<T>;
}

export function obtenerEquipos(): Promise<Equipo[]> {
  return peticion<Equipo[]>("/equipos");
}

export function obtenerPrestamosActivos(): Promise<Prestamo[]> {
  return peticion<Prestamo[]>("/prestamos?devuelto=false");
}

export function crearPrestamo(datos: NuevoPrestamo): Promise<Prestamo> {
  return peticion<Prestamo>("/prestamos", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarDisponibilidad(id: number, disponible: boolean): Promise<Equipo> {
  return peticion<Equipo>(`/equipos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ disponible }),
  });
}

export function marcarDevuelto(id: number): Promise<Prestamo> {
  return peticion<Prestamo>(`/prestamos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ devuelto: true }),
  });
}