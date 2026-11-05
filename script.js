
const screen = document.getElementById("screen");
const startButton = document.getElementById("startButton");

let currentStep = 0;

const scenes = [
  {
    title: "🍋 EL LIMÓN DEL DESTINO",
    text: "14 de febrero de 2025. En las escaleras del instituto, Iker llevaba un limón en la mano. Al cruzarse con Isis, decidió regalárselo. No sabía que acababa de regalarle el comienzo de una historia preciosa.",
    button: "RECORDAR"
  },
  {
    title: "💌 AQUEL MENSAJE",
    text: "Al llegar a casa, Iker preguntó por el limón. Y así empezó una conversación que duró hasta las 4 o las 5 de la mañana... aunque al día siguiente había clase.",
    button: "CONTINUAR"
  },
  {
    title: "🌙 LAS TRES ESCALERAS",
    text: "Una ventana, la luz de la luna y un beso que ninguno esperaba. Isis nunca olvidaría aquel momento.",
    button: "CONTINUAR"
  },
  {
    title: "⛏️ MISIÓN CREEPER",
    text: "¡A UN CREEPER! Isis gritó la advertencia en Minecraft... pero se quedó quieta. Y el creeper ganó. 😂",
    button: "JAJA, CONTINUAR"
  },
  {
    title: "🍥 MISIÓN NARUTO",
    text: "Una aventura de anime, películas y momentos compartidos. Isis empezó a descubrir Naruto, el anime favorito de Iker.",
    button: "CONTINUAR"
  },
  {
    title: "❤️ NUESTRA HISTORIA",
    text: "Entre películas, Minecraft, familia, risas y momentos difíciles, habéis aprendido y crecido juntos. Vuestra historia todavía continúa.",
    button: "CONTINUAR"
  }
];

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

  document.getElementById("nextButton").addEventListener("click", () => {
    currentStep++;

    if (currentStep < scenes.length) {
      showScene();
    } else {
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
      `;
    }
  });
}

startButton.addEventListener("click", () => {
  currentStep = 0;
  showScene();
});
