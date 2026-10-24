import { useState } from "react";
import type { FormEvent } from "react";
import type { DatosPrestamo, Equipo } from "../types";
import { MAX_DIAS_PRESTAMO } from "../config";
import { hoyISO, sumarDias } from "../utils/fechas";

interface FormularioPrestamoProps {
  equipo: Equipo;
  enviando: boolean;            // nuevo
  errorEnvio: string | null;    // nuevo
  onGuardar: (datos: DatosPrestamo) => void;
  onCancelar: () => void;
}

interface Errores {
  solicitante?: string;
  carne?: string;
  fechaLimite?: string;
  curso?: string;
}

const REGEX_CARNE = /^\d{4}-\d{2}-\d{5}$/;

export default function FormularioPrestamo({
  equipo,
  enviando,
  errorEnvio,
  onGuardar,
  onCancelar,
}: FormularioPrestamoProps) {
  const [solicitante, setSolicitante] = useState("");
  const [carne, setCarne] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [curso, setCurso] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  const esArduino = equipo.categoria === "Arduino";
  const hoy = hoyISO();
  const maxFecha = sumarDias(MAX_DIAS_PRESTAMO);

  function validar(): Errores {
    const e: Errores = {};

    if (solicitante.trim().length < 5) {
      e.solicitante = "El solicitante es obligatorio (mínimo 5 caracteres).";
    }

    if (!REGEX_CARNE.test(carne)) {
      e.carne = "Formato inválido. Use 0000-00-00000.";
    }

    if (!fechaLimite) {
      e.fechaLimite = "La fecha límite es obligatoria.";
    } else if (fechaLimite < hoy) {
      e.fechaLimite = "La fecha no puede ser anterior a hoy.";
    } else if (fechaLimite > maxFecha) {
      e.fechaLimite = `No puede superar ${MAX_DIAS_PRESTAMO} días (hasta ${maxFecha}).`;
    }

    if (esArduino && curso.trim().length === 0) {
      e.curso = "Los préstamos de Arduino exigen indicar el curso.";
    }

    return e;
  }

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      solicitante: solicitante.trim(),
      carne,
      fechaLimite,
      curso: esArduino ? curso.trim() : undefined,
    });
  }

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Prestar: {equipo.nombre}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Solicitante
            <input
              type="text"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
            />
            {errores.solicitante && <span className="error">{errores.solicitante}</span>}
          </label>

          <label>
            Carné
            <input
              type="text"
              placeholder="0000-00-00000"
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
            />
            {errores.carne && <span className="error">{errores.carne}</span>}
          </label>

          <label>
            Fecha límite
            <input
              type="date"
              min={hoy}
              max={maxFecha}
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
            />
            {errores.fechaLimite && <span className="error">{errores.fechaLimite}</span>}
          </label>

          {esArduino && (
            <label>
              Curso
              <input
                type="text"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
              />
              {errores.curso && <span className="error">{errores.curso}</span>}
            </label>
          )}

          {errorEnvio && <p className="error">{errorEnvio}</p>}

          <div className="acciones">
            <button type="button" onClick={onCancelar} disabled={enviando}>Cancelar</button>
            <button type="submit" disabled={enviando}>
             {enviando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}