# Handoff — Feedback de landing PastAR

**Proyecto:** PastAR — Landing Page
**Branch:** `feat/rediseno-pastar-brand`
**Fecha:** 2026-06-05
**Alcance:** 4 ítems de feedback sobre la página `/` (collar 3D, fondo de puntos, tarjetas de specs y fotos del equipo).

---

## Resumen rápido

| # | Feedback | Estado | Archivos |
|---|----------|--------|----------|
| 1 | La correa del collar 3D estaba mal hecha | ✅ Resuelto | `Collar3DScene.jsx` |
| 2 | El difumado y el fondo de puntitos | ✅ Resuelto | `Features.jsx`, `Features.module.css` |
| 3 | Tarjetas de specs → componente Folder | ✅ Resuelto | `Folder.jsx` (nuevo), `Folder.css` (nuevo), `CollarSensor.jsx`, `CollarSensor.module.css` |
| 4 | Agregar fotos a las tarjetas del equipo | 🟡 Parcial (3 de 5) | `Team.jsx`, `Team.module.css`, `public/images/team/*` |

---

## 1. Correa del collar (3D) ✅

**Problema:** la correa se veía torcida / como una cinta plana mal orientada.

**Causa:** la correa se generaba con `ExtrudeGeometry` barriendo una `CatmullRomCurve3` cerrada. El extrude usa *Frenet frames*, que en una curva cerrada se tuercen → la banda alternaba entre cara plana y canto, y se rompía visualmente.

**Solución:** se reemplazó por `makeBeltGeometry(radius, width, thickness, cornerR)`, que barre a mano una sección transversal de rectángulo redondeado alrededor del aro (ancho sobre el eje Y, espesor radial). La banda queda **siempre perpendicular** al aro, sin torsión, y lee como una correa sólida desde cualquier ángulo.

- Archivo: `src/components/CollarSensor/Collar3DScene.jsx`
- Se eliminó el helper `roundedRectShape` (ya no se usaba).
- La textura de nylon (`makeStrapBump`) y el material se conservaron.

---

## 2. Fondo de puntos + difumado de salida ✅

**Problema:** el "difumado" hacia la sección verde (`Cómo funciona`) se veía sucio: los puntos del `DotGrid` se filtraban a través del degradé verde.

**Solución:**
- **Máscara en el `DotGrid`** (`Features.jsx`): se le pasa un `mask-image` vertical para que los puntos aparezcan suaves arriba y **se desvanezcan antes** de la zona del degradé verde → ya no se ensucian.
- **Degradé de salida** (`Features.module.css`, `.section::after`): curva en dos tramos (`transparent → rgba(14,61,36,.65) 74% → #0E3D24`), más alto (280px) y suave.
- Ajustes finos del dot grid: `gap` 26→30, `baseColor` `#C8DDD0`→`#BBD3C4`.

> Si todavía no convence el fondo de puntos, está aislado en `Features.jsx`: se puede cambiar por otro background de React Bits (Squares, Particles, etc.) sin tocar el resto.

---

## 3. Tarjetas de specs → componente Folder ✅

**Pedido:** que las tarjetas tengan otra apariencia usando el componente **Folder de React Bits**, y que al apretarlo se vean todas las funcionalidades.

**Solución:** se portó el componente Folder al proyecto y se usa como disparador del detalle.

- **Componente nuevo:** `src/components/ui/Folder.jsx` + `src/components/ui/Folder.css`
  - Portado de React Bits, con colores de marca (verde).
  - Soporta estado **controlado**: props `open` y `onToggle(next)` (además del estado interno si no se controla).
  - Props: `color`, `size`, `items` (máx. 3 "papeles"), `open`, `onToggle`, `className`.
- **Integración:** `src/components/CollarSensor/CollarSensor.jsx`
  - Estado `specsOpen` en el componente.
  - **Cerrado por defecto:** carpeta verde + "6 componentes integrados" + botón **"Abrir la carpeta"**.
  - **Al abrir:** los papeles se abren en abanico y debajo se revelan las 6 specs (grid de 2 columnas) con animación escalonada (`AnimatePresence` + `framer-motion`).
  - Layout en columna (carpeta arriba, copy abajo) para que los papeles no tapen el título.
- Estilos en `CollarSensor.module.css`: `.folderIntro`, `.folderGraphic`, `.folderCopy`, `.folderTitle`, `.folderSubtitle`, `.folderToggle`, `.specsReveal`.

---

## 4. Fotos del equipo 🟡

**Pedido:** agregar las fotos a las tarjetas del equipo (sección `#team`, "El equipo").

**Implementación:** `src/components/Team/Team.jsx` ahora soporta un campo opcional `photo` por integrante. Si hay foto, se muestra en el avatar circular (`object-fit: cover`, `object-position: 50% 28%` para favorecer la cara); si no, cae a las **iniciales** sobre el color de acento. CSS en `Team.module.css` (`.avatar`, `.avatarImg`).

**Fotos agregadas** (en `public/images/team/`, redimensionadas a ≤900px):

| Integrante | Legajo | Foto |
|------------|--------|------|
| Tiziana Carrizo | 94506 | `pendant.jpg` ✅ |
| Agustín Rey Laje | 95535 | `rio.jpg` (camisa a rayas / mar) ✅ |
| Marco Figueroa | 94359 | `sweater.jpg` (sweater marrón) ✅ |
| José I. Maspero Castro | 94304 | — iniciales (no hubo foto) |
| Salvador Gibert | 94181 | — iniciales (**pendiente**, ver abajo) |

### ⚠️ Pendiente — foto de Salvador
La decisión fue "cortame a mí nomás" de la foto de graduación, **pero esa foto nunca quedó guardada en disco** (se pegó directo en la herramienta de feedback; tampoco estaba en el portapapeles). No hay archivo para recortar.

**Para terminar la tarjeta:**
1. Guardar una foto en `~/Downloads` — la de graduación (se recorta solo a Salvador del centro) o cualquier headshot individual.
2. Avisar / re-correr; se redimensiona y se agrega como `public/images/team/salvador.jpg`.
3. En `Team.jsx`, agregar `photo: '/images/team/salvador.jpg'` al integrante Salvador Gibert.

> Mismo procedimiento si aparece una foto para **José Maspero**.

---

## Cómo agregar/cambiar una foto del equipo

```bash
# 1. Redimensionar (cap a 900px de lado mayor) y copiar al proyecto
sips -Z 900 "/ruta/a/la/foto.jpg" --out public/images/team/<nombre>.jpg
```

```jsx
// 2. En src/components/Team/Team.jsx, asignar el campo photo
{ name: 'Salvador Gibert', initials: 'SG', legajo: '94181', color: '#7A4F35',
  photo: '/images/team/salvador.jpg' },
```

Si la cara queda mal encuadrada, ajustar `object-position` en `.avatarImg` (`Team.module.css`).

---

## Verificación

- Probado en el dev server (`npm run dev`, puerto 3000) en viewport desktop.
- Sin errores de consola tras los cambios (incluido WebGL del collar).
- Collar verificado desde varios ángulos del auto-rotate.
- Folder verificado en estado cerrado y abierto (los 6 componentes se revelan ok).
- 3 fotos del equipo cargan sin errores y encuadran bien.

## Notas

- `.claude/launch.json`: se agregó `"autoPort": true` para que la preview tool conviva con un `npm run dev` propio en el 3000.
- La herramienta de feedback (agentation) intercepta clicks cuando está en modo feedback; no afecta a la navegación normal del usuario.
- El scroll de la página usa `scroll-behavior: smooth` (relevante solo para scripting/QA).

## TODO

- [ ] Foto individual de **Salvador** (recorte de graduación o headshot).
- [ ] Decidir si **José Maspero** lleva foto o queda en iniciales.
- [ ] Opcional: validar el fondo de puntos del Features; si no gusta, probar otro background.
