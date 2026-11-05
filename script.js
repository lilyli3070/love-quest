
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
    title: "❤️ VUESTRA HISTORIA",
    text: "Entre películas, Minecraft, Naruto, familia, risas y momentos difíciles, habéis aprendido y crecido juntos. Y vuestra aventura todavía continúa.",
    button: "SEGUIR NUESTRA HISTORIA"
  }
];

function showScene() {
  const scene = scenes[currentStep];

  screen.innerHTML = `
    <div class="scene">
      <h1>${scene.title}</h1>
      <p>${scene.text}</p>
      <button id="nextButton">${scene.button}</button>
    </div>
  `;

  document.getElementById("nextButton").addEventListener("click", () => {
    currentStep++;

    if (currentStep < scenes.length) {
      showScene();
    } else {
      screen.innerHTML = `
        <div class="scene">
          <h1>💗 TO BE CONTINUED...</h1>
          <p>Para mi Amor, para mi Cuchi, para Iker.</p>
          <p>Con cariño, tu gabacha, Isis.</p>
          <p>Esta historia todavía tiene muchos capítulos por escribir.</p>
        </div>
      `;
    }
  });
}

startButton.addEventListener("click", () => {
  currentStep = 0;
  showScene();
});
