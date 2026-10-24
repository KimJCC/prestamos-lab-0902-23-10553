import type { Equipo } from "../types";
import Encabezado from "../components/Encabezado";
import ListaEquipos from "../components/ListaEquipos";

const equipos: Equipo[] = [
  { id: 1, nombre: "Raspberry Pi 4 Model B", categoria: "Raspberry Pi", disponible: true },
  { id: 2, nombre: "Raspberry Pi 5", categoria: "Raspberry Pi", disponible: true },
  { id: 3, nombre: "Raspberry Pi Zero 2 W", categoria: "Raspberry Pi", disponible: false },
  { id: 4, nombre: "Arduino Uno R3", categoria: "Arduino", disponible: true },
  { id: 5, nombre: "Arduino Mega 2560", categoria: "Arduino", disponible: true },
  { id: 6, nombre: "Arduino Nano", categoria: "Arduino", disponible: false },
  { id: 7, nombre: "Sensor ultrasónico HC-SR04", categoria: "Sensor", disponible: true },
  { id: 8, nombre: "Sensor de temperatura DHT11", categoria: "Sensor", disponible: true },
];

export default function Inventario() {
  const disponibles = equipos.filter((e) => e.disponible).length; // derivado, sin useState

  return (
    <>
      <Encabezado
        titulo="Préstamos Lab — 0902-23-10553"
        disponibles={disponibles}
        total={equipos.length}
      />
      <ListaEquipos equipos={equipos} onPrestar={(id) => console.log("Prestar", id)} />
    </>
  );
}