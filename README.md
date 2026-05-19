# Snake Game

Juego clásico de Snake creado con React y Vite. La aplicación incluye menú inicial,
tablero de juego, pausa, reinicio, pantalla de reglas, tabla de puntajes y guardado
local de los mejores puntajes en un archivo de texto.

## Requisitos

- Node.js 18 o superior.
- npm.
- Un navegador moderno como Chrome, Edge, Firefox o Brave.

## Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

## Ejecutar el proyecto

Para correr la aplicación en modo desarrollo:

```bash
npm run dev
```

Vite mostrará una URL parecida a esta:

```text
http://localhost:5173/
```

Abre esa URL en el navegador. No abras el archivo `index.html` directamente con
`file:///`, porque el juego usa una ruta local de API (`/api/highscore`) que solo
existe cuando el servidor de Vite está corriendo.

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor local de desarrollo. Este es el comando recomendado para jugar
y probar el guardado de puntajes.

```bash
npm run build
```

Genera la versión optimizada en la carpeta `dist/`.

```bash
npm run preview
```

Sirve la versión generada por `npm run build`. Ten en cuenta que el guardado de
puntajes en `data/highscore.txt` está implementado en el servidor de desarrollo
de Vite, por lo que la ruta `/api/highscore` está pensada principalmente para
`npm run dev`.

## Cómo jugar

- Presiona **Play** o **Enter** desde el menú inicial para comenzar.
- Usa las flechas del teclado para mover la serpiente.
- Come la comida roja para sumar 10 puntos y hacer crecer la serpiente.
- Evita chocar contra las paredes o contra el cuerpo de la serpiente.
- Presiona **Space** para pausar o continuar la partida.
- Usa **Restart** para iniciar una partida nueva.
- Entra a **Leaderboard** para ver los mejores puntajes guardados.

## Puntajes

Los puntajes se guardan en:

```text
data/highscore.txt
```

El archivo guarda hasta 10 puntajes, uno por línea, ordenados de mayor a menor.
La aplicación también soporta el formato antiguo de un solo puntaje.

La API local está definida dentro de `vite.config.js`:

- `GET /api/highscore`: lee los puntajes guardados.
- `POST /api/highscore`: recibe un puntaje nuevo y actualiza la tabla.

Ejemplo del cuerpo enviado al guardar:

```json
{
  "score": 50
}
```

## Estructura del proyecto

```text
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

Esto suele indicar que el problema está en la configuración o datos guardados del
perfil normal de Brave, no necesariamente en el código del juego.

Prueba lo siguiente:

1. Abre exactamente la URL que muestra Vite, por ejemplo:

   ```text
   http://localhost:5173/
   ```

   Si no funciona, prueba también:

   ```text
   http://127.0.0.1:5173/
   ```

2. Verifica que no estés usando `https://` ni `file:///`.

3. Desactiva **Brave Shields** para la página local.

4. Recarga sin caché con:

   ```text
   Ctrl + Shift + R
   ```

5. Borra los datos guardados del sitio:

   - Abre DevTools con `F12`.
   - Ve a **Application**.
   - En **Storage**, usa **Clear site data**.
   - Si aparece algún **Service Worker**, usa **Unregister**.

6. Desactiva extensiones del perfil normal de Brave. Si en incógnito funciona,
   una extensión o un dato guardado del perfil normal puede estar bloqueando la
   carga.

7. Revisa DevTools:

   - En **Console**, busca errores de JavaScript.
   - En **Network**, confirma que los archivos `.js` cargan con estado `200`.
   - Revisa si `/api/highscore` aparece bloqueado o con error.

8. Reinicia el servidor:

   ```bash
   npm run dev
   ```

### Los puntajes no se guardan

- Asegúrate de correr el proyecto con `npm run dev`.
- Verifica que exista la carpeta `data/`.
- Revisa que `data/highscore.txt` tenga permisos de escritura.
- Abre DevTools y revisa si la petición `POST /api/highscore` falla.

### El juego se ve en blanco

- Confirma que el servidor de Vite siga corriendo en la terminal.
- Abre la URL exacta que muestra Vite.
- Revisa errores en la pestaña **Console** de DevTools.
- Borra la caché del navegador y recarga.

## Tecnologías usadas

- React 18.
- Vite 6.
- CSS.
- Middleware local de Vite para leer y escribir los puntajes.
