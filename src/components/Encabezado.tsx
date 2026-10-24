interface EncabezadoProps {
  titulo: string;
  disponibles: number;
  total: number;
}

export default function Encabezado({ titulo, disponibles, total }: EncabezadoProps) {
  return (
    <header>
      <h1>{titulo}</h1>
      <p>{disponibles} de {total} equipos disponibles</p>
    </header>
  );
}