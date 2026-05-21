# Snake Game

Juego clásico de Snake creado con React y Vite. La aplicación ofrece: menú
inicial, tablero de juego, pausa, reinicio, pantalla de reglas, tabla de
puntajes y guardado local de los mejores puntajes en `data/highscore.txt`.

## Resumen del proyecto

- Nombre del proyecto: `snake-game`
- Versión: `0.1.0`
- Tipo: `module`
- Dependencias principales: `react@^18.3.1`, `react-dom@^18.3.1`
- DevDependencies: `vite@^6.0.5`, `@vitejs/plugin-react@^4.3.4`

## Requisitos

- Node.js 18 o superior
- npm (o yarn/pnpm)
- Un navegador moderno (Chrome, Edge, Firefox, Brave)

## Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

## Desarrollo

Arranca el servidor de desarrollo (incluye la API local para guardar puntajes):

```bash
npm run dev
```

Vite mostrará una URL, por ejemplo `http://localhost:5173/`. No abras
`index.html` directamente con `file:///` porque la API local (`/api/highscore`)
está disponible solo cuando el servidor de Vite está corriendo.

## Scripts disponibles

- `npm run dev` — inicia el servidor de desarrollo (recomendado para jugar y
   probar guardado de puntajes).
- `npm run build` — genera la versión optimizada en `dist/`.
- `npm run preview` — sirve la versión generada por `npm run build`.

> Nota: la API de puntajes está diseñada principalmente para `npm run dev`.

## Cómo jugar

- Presiona **Play** o **Enter** desde el menú inicial para comenzar.
- Usa las flechas del teclado para mover la serpiente.
- Come la comida para sumar puntos y hacerla crecer.
- Evita chocar contra las paredes o el cuerpo de la serpiente.
- Presiona **Space** para pausar/continuar.
- Usa **Restart** para reiniciar la partida.
- Abre **Leaderboard** para ver los mejores puntajes guardados.

## Guardado de puntajes

Los puntajes se guardan en:

```text
data/highscore.txt
```

El archivo guarda hasta 10 puntajes, uno por línea, ordenados de mayor a
menor. La aplicación también soporta el formato antiguo de un solo puntaje.

La API local está definida en `vite.config.js`:

- `GET /api/highscore` — lee los puntajes guardados.
- `POST /api/highscore` — recibe un puntaje nuevo y actualiza la tabla.

Ejemplo del cuerpo enviado al guardar:

```json
{
   "score": 50
}
```

## Estructura del proyecto

```
data/
   highscore.txt          Archivo local donde se guardan los puntajes.

src/
   App.jsx                Lógica principal del juego, pantallas y controles.
   main.jsx               Punto de entrada de React.

   components/
      Board.jsx            Renderiza el tablero.
      Food.jsx             Renderiza la comida.
      HighScore.jsx        Muestra el puntaje más alto.
      LeaderboardTable.jsx Tabla de mejores puntajes.
      Score.jsx            Muestra el puntaje actual.
      Snake.jsx            Renderiza la serpiente.

   styles/
      game.css             Estilos visuales del juego.

index.html               HTML base usado por Vite.
package.json             Dependencias y scripts del proyecto.
vite.config.js           Configuración de Vite y API local de puntajes.
```

## Solución de problemas

### La página no carga en Brave, pero sí funciona en incógnito u otro navegador

Esto suele indicar que el problema está en la configuración o datos guardados
del perfil normal de Brave. Prueba lo siguiente:

1. Abre la URL que muestra Vite, por ejemplo `http://localhost:5173/` o
    `http://127.0.0.1:5173/`.
2. Verifica que no estés usando `https://` ni `file:///`.
3. Desactiva Brave Shields para la página local.
4. Recarga sin caché: `Ctrl + Shift + R`.
5. Borra datos del sitio en DevTools (Application → Clear site data) y
    desregistra Service Workers si existen.
6. Desactiva extensiones del perfil normal si en incógnito funciona.
7. Revisa errores en DevTools (Console / Network) y confirma que `/api/highscore`
    no esté bloqueado.
8. Reinicia el servidor: `npm run dev`.

### Los puntajes no se guardan

- Asegúrate de correr el proyecto con `npm run dev`.
- Verifica que exista la carpeta `data/`.
- Revisa que `data/highscore.txt` tenga permisos de escritura.
- Abre DevTools y revisa si la petición `POST /api/highscore` falla.

### El juego se ve en blanco

- Confirma que el servidor de Vite siga corriendo.
- Abre la URL exacta que muestra Vite.
- Revisa errores en la pestaña Console de DevTools.
- Borra la caché del navegador y recarga.

## Tecnologías usadas

- React 18 (react@^18.3.1)
- Vite 6 (vite@^6.0.5)
- @vitejs/plugin-react@^4.3.4
- CSS

## Notas para desarrolladores

- El guardado de puntajes usa middleware en `vite.config.js` y escribe en
   `data/highscore.txt` durante el modo de desarrollo.
- Para probar funciones relacionadas con la API de puntajes, usa `npm run dev`.

---

Si quieres que traduzca el README al inglés o añada secciones (contribuir,
pruebas, CI), dime y lo preparo.
