# AGENTS.md

## Proyecto
Juego de Snake con React + Vite

## Objetivo del Proyecto
Desarrollar una implementación del juego clásico Snake utilizando React y Vite, enfocándose principalmente en:

- Uso correcto de componentes React
- Manejo de estado con hooks
- Comunicación entre componentes mediante props
- Organización y separación lógica del código
- Estructura reutilizable y mantenible

El objetivo NO es únicamente que el juego funcione, sino que esté correctamente construido usando buenas prácticas de React.

---

# Stack Tecnológico

## Tecnologías obligatorias
- React
- JSX
- Vite
- JavaScript

## Creación del proyecto
```bash
npm create vite@latest snake-game -- --template react
cd snake-game
npm install
npm run dev
Arquitectura Obligatoria

La aplicación debe estar separada al menos en los siguientes componentes:

src/
│
├── App.jsx
├── components/
│   ├── Board.jsx
│   ├── Snake.jsx
│   ├── Food.jsx
│   └── Score.jsx
│
├── styles/
│   └── game.css
│
└── main.jsx
Componentes mínimos requeridos
App / Game

Responsabilidad:

Contenedor principal del juego
Manejo del estado global del juego
Loop principal
Coordinación de componentes

Debe manejar:

Estado de la serpiente
Dirección actual
Comida
Puntaje
Game Over
Board

Responsabilidad:

Renderizar el tablero
Mostrar todos los elementos visuales

Debe recibir mediante props:

Snake
Food
Tamaño del tablero
Snake

Responsabilidad:

Renderizar los segmentos de la serpiente

Debe:

Recibir posiciones mediante props
No manejar lógica global del juego
Food

Responsabilidad:

Mostrar la comida en el tablero

Debe:

Recibir posición mediante props
Score

Responsabilidad:

Mostrar el puntaje actual

Debe:

Recibir score mediante props
Requerimientos Funcionales
Movimiento

La serpiente debe poder moverse usando teclado.

Teclas recomendadas:

ArrowUp
ArrowDown
ArrowLeft
ArrowRight
Crecimiento

La serpiente debe:

Detectar cuando come comida
Aumentar de tamaño
Incrementar puntaje
Colisiones

El juego debe detectar:

Colisión con paredes
Colisión consigo misma
Game Over

Cuando ocurra una colisión:

El juego debe detenerse
Debe mostrarse un mensaje de Game Over
Puntaje

Debe existir un contador visible de score.

Restricciones Importantes
NO permitido

❌ Implementar todo en un solo componente

❌ Usar variables globales para manejar el estado

❌ Manipular el DOM manualmente:

document.getElementById()
querySelector()
innerHTML

❌ Mezclar toda la lógica en un único archivo

Obligatorio

✅ Uso de useState

✅ Uso de useEffect

✅ Comunicación entre componentes usando props

✅ Separación clara de responsabilidades

✅ Estructura organizada

Hooks Requeridos
useState

Debe utilizarse para:

Snake
Dirección
Comida
Puntaje
Estado del juego

Ejemplo:

const [snake, setSnake] = useState(initialSnake);
useEffect

Debe utilizarse para:

Loop del juego
Eventos de teclado

Ejemplo:

useEffect(() => {
  const interval = setInterval(moveSnake, speed);

  return () => clearInterval(interval);
}, [snake, direction]);
Flujo Recomendado de Desarrollo
Paso 1

Configurar proyecto con Vite.

Verificar:

npm run dev
Paso 2

Crear tablero básico.

Paso 3

Renderizar serpiente estática.

Paso 4

Agregar movimiento.

Paso 5

Agregar comida.

Paso 6

Implementar crecimiento.

Paso 7

Implementar colisiones.

Paso 8

Agregar puntaje.

Paso 9

Agregar pantalla de Game Over.

Criterios de Evaluación
Uso de React — 40 pts
Separación en componentes — 20 pts
Componentes independientes
Responsabilidades claras
Reutilización
Uso de props — 10 pts
Props bien utilizadas
Comunicación correcta entre componentes
Estado y hooks — 10 pts
Uso correcto de useState
Uso correcto de useEffect
Lógica del Juego — 30 pts
Movimiento — 10 pts
Movimiento funcional y continuo
Colisiones — 10 pts
Detección correcta
Crecimiento y puntaje — 10 pts
Crecimiento funcional
Score actualizado correctamente
Estructura del Código — 20 pts
Organización — 10 pts
Código limpio
Nombres descriptivos
Orden lógico
Responsabilidades — 10 pts
Lógica separada correctamente
Componentes no sobrecargados
Interfaz — 10 pts
Visual — 10 pts
Tablero entendible
Elementos visibles
Interfaz usable
Extras (+15 pts)
Animaciones suaves — +5 pts

Ejemplos:

Movimiento fluido
Transiciones CSS
Pantalla de inicio o reinicio — +5 pts

Ejemplos:

Botón Restart
Start Screen
Niveles o dificultad progresiva — +5 pts

Ejemplos:

Aumentar velocidad
Incrementar dificultad
Entrega
Repositorio GitHub

Debe incluir:

Código completo
.gitignore
Sin node_modules
README.md Obligatorio

Debe incluir:

Descripción

Breve explicación del proyecto.

Instalación
npm install
npm run dev
Cómo jugar

Explicar:

Controles
Objetivo
Reglas básicas
Buenas Prácticas Recomendadas
Organización
Mantener componentes pequeños
Evitar duplicación
Separar estilos
Nombres claros

Ejemplos:

snakePosition
foodPosition
gameOver
score
Evitar lógica innecesaria en JSX

Mover lógica compleja fuera del return.

Mantener render limpio

Evitar componentes gigantes.

Recomendaciones Técnicas
Tamaño del tablero

Usar grid.

Ejemplo:

display: grid;
grid-template-columns: repeat(20, 20px);
Loop del juego

Usar:

setInterval

dentro de:

useEffect
Manejo de teclado

Usar:

window.addEventListener("keydown", handleKeyDown);

con limpieza adecuada:

return () => {
  window.removeEventListener("keydown", handleKeyDown);
};
Resultado Esperado

El proyecto final debe:

Ejecutarse correctamente con:
npm install
npm run dev
Tener estructura React clara
Estar organizado
Ser mantenible
Implementar correctamente el juego Snake
Demostrar comprensión real de React y componentes