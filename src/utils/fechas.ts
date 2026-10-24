function formatear(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

export function hoyISO(): string {
  return formatear(new Date());
}

export function sumarDias(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return formatear(d);
}