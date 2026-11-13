# Elección de líderes de nodo (Pacífico y Cafetero)

Frontend en **GitHub Pages**, API en **Google Apps Script** y datos en **Google Sheets**.

| Archivo | Qué es |
|---|---|
| `index.html` | Página de votación para los docentes (celular) |
| `resultados.html` | Torta de votos recibidos y pendientes por nodo. Muestra el podio al cerrar |
| `admin.html` | Panel: candidatos, docentes habilitados, abrir/cerrar, segunda vuelta |
| `config.js` | URL de la API (la tienes que pegar aquí) |
| `styles.css` | Estilos compartidos |
| `Code.gs` | API. Va en Apps Script, **no** en GitHub |

## 1. Google Sheet + Apps Script (unos 10 minutos)

1. Crea una Google Sheet vacía, por ejemplo "Elección líderes de nodo 2026".
2. Ve a **Extensiones > Apps Script**, borra lo que haya y pega `Code.gs`. Guarda.
3. En el menú de funciones selecciona `setup` y haz clic en **Ejecutar**. Autoriza los permisos.
   - Se crean las hojas `Candidatos`, `Votantes`, `Config` e `Historial`.
   - En **Registro de ejecución** aparece la **clave del panel de administración**. Guárdala.
   - Para cambiarla: ⚙️ Configuración del proyecto > Propiedades del script > `ADMIN_PASSWORD`.
4. Ve a **Implementar > Nueva implementación > Tipo: Aplicación web** y configura:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Copia la URL que termina en `/exec`.

> Si después modificas `Code.gs`, ve a **Implementar > Gestionar implementaciones > ✏️ > Versión: Nueva versión**.
> Si en cambio creas una implementación nueva, la URL cambia.

## 2. GitHub Pages

1. En `config.js`, reemplaza `PEGA_AQUI_LA_URL_DEL_WEB_APP` por la URL `/exec`.
2. Sube `index.html`, `resultados.html`, `admin.html`, `config.js` y `styles.css` al repositorio.
3. Ve a **Settings > Pages > Deploy from branch > main / root**.
4. Comparte con los docentes solo `https://TU-USUARIO.github.io/REPO/`. El panel queda en `/admin.html`.

## 3. Antes del día de la votación

1. En **admin.html**, pestaña **Candidatos**, carga los 6 candidatos de cada nodo.
2. En la pestaña **Docentes habilitados**, pega la lista (68 del Pacífico y 32 del Cafetero).
   Usa una línea por docente con cédula, nombre y nodo. Puedes copiar las 3 columnas directo de Excel.
3. **Haz una prueba completa:** abre la votación, vota con 2 o 3 cédulas desde un celular, cierra,
   revisa el podio y luego usa **Reiniciar (pruebas)** en cada nodo.

## 4. Día de la votación

- **Abrir votación** en cada nodo y proyectar `resultados.html`.
- **Cerrar votación**: el podio aparece automáticamente en `resultados.html`.
- **Empate en el 1.er lugar**: usa **Iniciar segunda vuelta**. Quedan solo los empatados,
  los votos vuelven a cero y todos los docentes del nodo pueden votar de nuevo.
  Después debes **Abrir votación** otra vez.
  Los resultados de cada cierre quedan guardados en la hoja `Historial`.

## Cómo protege los votos

- **Ni duplicados ni perdidos:** cada voto se registra con un bloqueo (`LockService`), uno a la vez.
  Si el celular pierde la señal, la página reintenta. Si el voto ya había entrado, responde "ya registrado"
  y no cuenta doble.
- **Voto secreto:** la hoja `Votantes` solo marca *que* la cédula votó.
  La hoja `Candidatos` solo suma +1 al candidato. No hay ningún registro que una cédula con un candidato.
- **Auditoría:** el panel verifica que la suma de votos sea igual al número de docentes que votaron (✓ Conteo verificado).
- **Sin resultados parciales:** mientras el nodo está abierto, ni la página pública ni el panel muestran votos por candidato.
