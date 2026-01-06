# 🧙‍♂️ Juego de Estrategia Medieval Fantástico por Turnos

Juego online para **2 jugadores**, inspirado en el ajedrez pero ambientado en el universo del **Señor de los Anillos**. Cada jugador controla héroes y unidades con habilidades únicas en un tablero de **12x18 casillas** (pasto y tierra). El objetivo es derrotar al oponente protegiendo al **Rey** y utilizando estrategia, recursos y habilidades.

---

## ⚙️ Tecnologías
- **Frontend:** React.js
- **Backend y tiempo real:** Firebase (Firestore + Auth)
- **UI responsiva:** Bootstrap 5 (Grid System)
- **Hosting:** Firebase Hosting

---

## 🎮 Mecánica de Juego
- **Jugadores:** 2 en línea.
- **Turnos:** alternos, cada jugador realiza **2 acciones por turno**.
- **Acciones posibles:**
  - Invocar una unidad.
  - Mover una unidad.
  - Crear un objeto/herramienta.
  - Realizar un ataque.

---

## 🧩 Tablero
- **Dimensiones:** 12x18 casillas.
- **Estética:** alterna entre pasto y tierra (en lugar de blanco y negro).
- **Casillas especiales:** muros y estructuras que pueden ser destruidos o utilizados estratégicamente.

---

## 🧙‍♂️ Personajes y Roles
- **Rey:** pieza central, su derrota significa perder la partida.
- **Obrero:**
  - Recolecta recursos: madera, hierro, piedra y algodón.
  - Crea herramientas y armas.
  - Herramientas disponibles: martillo, pico, hacha y asada.
  - Materiales: madera, piedra o hierro.
- **Arquero:**
  - Usa arco para disparar flechas.
  - Distancia de ataque depende de la **calidad del arma (1, 2 o 3)**.
- **Mago:**
  - Lanza hechizos de fuego.
  - Poder del hechizo depende de la **calidad de su arma**.
- **Ariete:**
  - Sirve para derrumbar muros.
  - Daño a muros depende de la **calidad del ariete**.

---

## 🛠️ Recursos
- **Tipos:** madera, hierro, piedra, algodón.
- **Obtención:** mediante obreros en casillas de recolección.
- **Uso:** invocar unidades, crear herramientas.

---

## 📜 Reglas
1. Cada jugador tiene un **Rey** que debe proteger.
2. Cada turno permite **2 acciones**.
3. Los obreros son esenciales para generar recursos y fabricar herramientas.
4. La calidad de las armas y herramientas (1, 2 o 3) determina su efectividad.
5. Los muros pueden ser destruidos con arietes.
6. El jugador que elimine al Rey enemigo gana la partida.

---

## 📐 Diseño Responsivo
- **Bootstrap Grid** para adaptar el tablero y paneles de control a PC, tablet y móvil.
- **Layout:**
  - Tablero central.
  - Panel lateral con recursos y acciones.
  - Barra superior con estado de partida.

---

## 🔥 Firebase
- **Auth:** registro e inicio de sesión.
- **Firestore:** estado del tablero, recursos, acciones y partidas.
- **Realtime updates:** sincronización de movimientos y ataques en tiempo real.

---

## 🧪 Páginas Principales
1. **Home (Bienvenida):**
   - Registro e inicio de sesión.
2. **Lobby:**
   - Emparejamiento de jugadores.
   - Creación y unión a salas.
3. **Área de Batalla:**
   - Tablero 12x18.
   - Visualización de héroes, recursos y acciones.
   - Turnos sincronizados en tiempo real.

---