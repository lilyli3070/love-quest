
const screen = document.getElementById("screen");

let currentStep = -1;

const scenes = [
  {
    title: "🍋 EL LIMÓN DEL DESTINO",
    text: "14 de febrero de 2025. En las escaleras del instituto, Iker llevaba un limón. Al cruzarse con Isis, decidió regalárselo. No sabía que aquel limón sería el comienzo de una historia preciosa.",
    button: "RECORDAR"
  },
  {
    title: "💌 AQUEL MENSAJE",
    text: "Al llegar a casa, Iker preguntó qué había hecho Isis con el limón. Y así empezó una conversación que duró hasta las 4 o las 5 de la mañana.",
    button: "CONTINUAR"
  },
  {
    title: "🌙 LAS TRES ESCALERAS",
    text: "Una ventana, la luz de la luna y un beso que ninguno esperaba. Un momento que Isis nunca olvidaría.",
    button: "CONTINUAR"
  },
  {
    title: "⛏️ MISIÓN CREEPER",
    text: "¡A UN CREEPER! Isis gritó la advertencia en Minecraft, pero se quedó quieta. ¡Y el creeper ganó! 😂",
    button: "JAJA, CONTINUAR"
  },
  {
    title: "🍥 MISIÓN NARUTO",
    text: "Isis empezó a descubrir el anime favorito de Iker. Una nueva aventura que compartir.",
    button: "CONTINUAR"
  },
  {
    title: "❤️ NUESTRA HISTORIA",
    text: "Películas, Minecraft, familia, risas y momentos difíciles. Habéis aprendido y crecido juntos. Y vuestra historia continúa.",
    button: "CONTINUAR"
  }
];

function showStart() {
  currentStep = -1;

  screen.innerHTML = `
    <div class="pixel-heart">♥</div>
    <p class="subtitle">A SPECIAL ADVENTURE FOR YOU</p>
    <h1>LOVE QUEST</h1>
    <p class="intro">Una aventura creada con mucho amor...</p>
    <div class="pixel-character">♡</div>
    <button id="startButton">START GAME ♥</button>
    <p class="footer">PLAYER 1 · PRESS START</p>
  `;
}

function showScene() {
  const scene = scenes[currentStep];

  screen.innerHTML = `
    <div class="pixel-heart">♥</div>
    <p class="subtitle">LOVE QUEST · NIVEL ${currentStep + 1}</p>
    <h1>${scene.title}</h1>
    <p class="intro">${scene.text}</p>
    <div class="pixel-character">♡</div>
    <button id="nextButton">${scene.button}</button>
    <p class="footer">PLAYER 1 · ISIS & IKER</p>
  `;
}

function showEnding() {
  screen.innerHTML = `
    <div class="pixel-heart">♥</div>
    <h1>TO BE CONTINUED...</h1>
    <p class="intro">
      Para mi Amor, para mi Cuchi, para Iker.
      <br><br>
      Con cariño, tu gabacha, Isis.
      <br><br>
      Esta historia todavía tiene muchos capítulos por escribir. 💗
    </p>
    <button id="restartButton">VOLVER A JUGAR</button>
  `;
}

screen.addEventListener("click", function(event) {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.id === "startButton") {
    currentStep = 0;
    showScene();
  } 
  else if (button.id === "nextButton") {
    currentStep++;

    if (currentStep < scenes.length) {
      showScene();
    } else {
      showEnding();
    }
  } 
  else if (button.id === "restartButton") {
    showStart();
  }
});

showStart();
