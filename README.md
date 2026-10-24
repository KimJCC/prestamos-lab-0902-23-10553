# Préstamos Lab — 0902-23-10553

Aplicación web para controlar el préstamo de equipos del laboratorio.
Variante 2 o 3: Raspberry Pi, Arduino y Sensor, máximo 7 días,
campo "Curso" obligatorio en préstamos de Arduino.

## Requisitos
- Node.js 18 o superior

## Instalación
```bash
git clone https://github.com/KimJCC/prestamos-lab-0902-23-10553.git
cd prestamos-lab-0902-23-10553
npm install
```
Copie `.env.example` a `.env` (contiene `VITE_API_URL=http://localhost:3001`).

## Ejecución
En una terminal, levantar la API:
```bash
npm run api
```
En otra terminal, el frontend:
```bash
npm run dev
```
Abrir la dirección que muestra Vite (normalmente http://localhost:5173).
