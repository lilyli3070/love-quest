
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const startButton = document.getElementById("startButton");

  const dialogue = document.getElementById("dialogue");
  const dialogueTitle = document.getElementById("dialogueTitle");
  const dialogueText = document.getElementById("dialogueText");
  const dialogueButton = document.getElementById("dialogueButton");

  const memoryCounter = document.getElementById("memoryCounter");
  const gameMessage = document.getElementById("gameMessage");
  const interactButton = document.getElementById("interactButton");

  const TILE = 32;
  const COLS = 20;
  const ROWS = 15;

  const map = [
    "####################",
    "#..................#",
    "#..##..............#",
    "#..................#",
    "#......##..........#",
    "#..................#",
    "#..........##......#",
    "#..................#",
    "#....##............#",
    "#..................#",
    "#..................#",
    "#..............##..#",
    "#..................#",
    "#..................#",
    "####################"
  ];

  const player = { x: 2, y: 2 };
  const isis = { x: 9, y: 7 };

  const playerAnimation = {
    direction: "down",
    frame: 0
  };

  const memories = [
    {
      id: "lemon",
      x: 16,
      y: 3,
      emoji: "🍋",
      title: "EL LIMÓN DEL DESTINO",
      text: "14 de febrero de 2025. En las escaleras del instituto, Iker regaló un limón a Isis. Ella lo guardó en su estuche. Un pequeño regalo que terminó siendo el comienzo de vuestra historia."
    },
    {
      id: "stairs",
      x: 4,
      y: 10,
      emoji: "🌙",
      title: "LAS TRES ESCALERAS",
      text: "Una ventana, la luz de la luna y un beso que ninguno esperaba. Un momento mágico que Isis nunca olvidaría."
    },
    {
      id: "creeper",
      x: 14,
      y: 10,
      emoji: "⛏️",
      title: "MISIÓN CREEPER",
      text: "¡A UN CREEPER! Isis gritó en Minecraft, pero se quedó quieta. ¡Y el creeper ganó!"
    },
    {
      id: "naruto",
      x: 10,
      y: 3,
      emoji: "🍥",
      title: "MISIÓN NARUTO",
      text: "Isis empezó a descubrir el anime favorito de Iker. Otra aventura que podían compartir."
    }
  ];

  const collected = new Set();

  let gameStarted = false;
  let dialogueOpen = false;
  let dialogueCallback = null;
  let inGarden = false;
  let gardenUnlocked = false;
  let quizIndex = 0;

  // Creamos el espacio donde aparecerán las respuestas.
  const answerContainer = document.createElement("div");
  answerContainer.style.display = "flex";
  answerContainer.style.flexDirection = "column";
  answerContainer.style.gap = "10px";
  answerContainer.style.marginTop = "16px";
  dialogue.appendChild(answerContainer);

  const questions = [
    {
      question: "🐶 ¿Cuándo cumple Kira?",
      answers: [
        "El 20 de mayo",
        "El 20 de junio",
        "No tiene cumpleaños"
      ],
      correct: 1
    },
    {
      question: "🎁 ¿Cuál fue el primer regalo hecho a mano que te hice?",
      answers: [
        "Una carta romántica",
        "Un tarro con un Spider-Man",
        "Una carta con dibujos"
      ],
      correct: 1
    },
    {
      question: "🍰 ¿Cuál es mi postre favorito?",
      answers: [
        "Coulant",
        "Tiramisú",
        "Brownie"
      ],
      correct: 0
    }
  ];

  function isWall(x, y) {
    return (
      x < 0 ||
      y < 0 ||
      x >= COLS ||
      y >= ROWS ||
      map[y][x] === "#"
    );
  }

  function updateCounter() {
    memoryCounter.textContent =
      `RECUERDOS: ${collected.size}/4`;
  }

  function drawBoy(x, y) {
    const px = x * TILE;
    const py = y * TILE;

    // Pelo rizado
    ctx.fillStyle = "#17121b";
    ctx.fillRect(px + 8, py + 3, 16, 7);
    ctx.fillRect(px + 5, py + 7, 22, 7);

    // Cara
    ctx.fillStyle = "#713e2b";
    ctx.fillRect(px + 8, py + 11, 16, 12);

    // Ojos
    ctx.fillStyle = "#17121b";
    ctx.fillRect(px + 12, py + 15, 2, 2);
    ctx.fillRect(px + 19, py + 15, 2, 2);

    // Camiseta
    ctx.fillStyle = "#fff7f1";
    ctx.fillRect(px + 7, py + 23, 18, 5);

    // Piernas
    ctx.fillStyle = "#21152f";
    const step = playerAnimation.frame === 0 ? 0 : 2;

    ctx.fillRect(px + 8, py + 28 + step, 7, 4 - step);
    ctx.fillRect(px + 17, py + 28 - step, 7, 4 - step);
  }

  function drawGirl(x, y) {
    const px = x * TILE;
    const py = y * TILE;

    // Pelo largo
    ctx.fillStyle = "#30202b";
    ctx.fillRect(px + 6, py + 4, 20, 22);
    ctx.fillRect(px + 4, py + 9, 5, 20);
    ctx.fillRect(px + 23, py + 9, 5, 20);

    // Cara
    ctx.fillStyle = "#edc29d";
    ctx.fillRect(px + 10, py + 10, 12, 12);

    // Ojos
    ctx.fillStyle = "#79502f";
    ctx.fillRect(px + 12, py + 14, 2, 2);
    ctx.fillRect(px + 19, py + 14, 2, 2);

    // Camiseta
    ctx.fillStyle = "#fff7f1";
    ctx.fillRect(px + 8, py + 23, 16, 5);

    // Vaqueros
    ctx.fillStyle = "#426eb3";
    ctx.fillRect(px + 9, py + 28, 6, 4);
    ctx.fillRect(px + 17, py + 28, 6, 4);
  }

  function drawTreesAndGrass() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (map[y][x] === "#") {
          ctx.fillStyle = "#493b35";
          ctx.fillRect(x * TILE + 12, y * TILE + 19, 9, 13);

          ctx.fillStyle = "#286044";
          ctx.fillRect(x * TILE + 3, y * TILE + 5, 26, 20);

          ctx.fillStyle = "#397c50";
          ctx.fillRect(x * TILE + 8, y * TILE + 1, 17, 13);
        } else {
          ctx.fillStyle = (x + y) % 2 === 0
            ? "#91c879"
            : "#88bd70";

          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
    }
  }

  function drawFlowers(flowers) {
    flowers.forEach(([x, y, color]) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * TILE + 9, y * TILE + 10, 5, 5);
      ctx.fillRect(x * TILE + 18, y * TILE + 10, 5, 5);

      ctx.fillStyle = "#fff7d1";
      ctx.fillRect(x * TILE + 14, y * TILE + 14, 5, 5);

      ctx.fillStyle = "#397c50";
      ctx.fillRect(x * TILE + 15, y * TILE + 19, 3, 6);
    });
  }

  function drawGarden() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Césped del jardín secreto
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = (x + y) % 2 === 0
          ? "#a4d98a"
          : "#96cf7d";

        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }

    // Borde de arbustos
    for (let x = 0; x < COLS; x++) {
      ctx.fillStyle = "#286044";
      ctx.fillRect(x * TILE, 0, TILE, TILE);
      ctx.fillRect(x * TILE, 14 * TILE, TILE, TILE);
    }

    for (let y = 0; y < ROWS; y++) {
      ctx.fillStyle = "#286044";
      ctx.fillRect(0, y * TILE, TILE, TILE);
      ctx.fillRect(19 * TILE, y * TILE, TILE, TILE);
    }

    // Caminito de flores
    for (let x = 2; x < 18; x++) {
      ctx.fillStyle = "#e7c9a4";
      ctx.fillRect(x * TILE + 5, 7 * TILE + 10, 22, 13);
    }

    const gardenFlowers = [
      [3, 3, "#ff8fba"],
      [5, 5, "#fff0a6"],
      [7, 10, "#f5a6e8"],
      [11, 3, "#ff8fba"],
      [13, 5, "#fff0a6"],
      [16, 3, "#f5a6e8"],
      [4, 11, "#fff0a6"],
      [8, 12, "#ff8fba"],
      [14, 11, "#f5a6e8"],
      [17, 10, "#fff0a6"]
    ];

    drawFlowers(gardenFlowers);

    // Corazones decorativos
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.fillText("💗", 7 * TILE + 16, 5 * TILE + 24);
    ctx.fillText("🌷", 13 * TILE + 16, 10 * TILE + 24);
    ctx.fillText("✨", 16 * TILE + 16, 5 * TILE + 24);

    // Puerta de salida
    ctx.fillStyle = "#8b526e";
    ctx.fillRect(TILE + 5, 7 * TILE + 3, 22, 27);
    ctx.fillStyle = "#ffd6ec";
    ctx.fillRect(TILE + 11, 7 * TILE + 9, 10, 15);

    drawGirl(14, 7);
    drawBoy(player.x, player.y);
  }

  function drawWorld() {
    if (inGarden) {
      drawGarden();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTreesAndGrass();

    // Caminos de tierra
    for (let x = 2; x <= 17; x++) {
      ctx.fillStyle = "#c9a477";
      ctx.fillRect(x * TILE + 5, 7 * TILE + 9, 22, 15);
    }

    for (let y = 2; y <= 12; y++) {
      ctx.fillStyle = "#c9a477";
      ctx.fillRect(9 * TILE + 5, y * TILE + 9, 22, 15);
    }

    const flowers = [
      [2, 5, "#ff8fba"],
      [5, 3, "#fff0a6"],
      [7, 9, "#f5a6e8"],
      [12, 2, "#fff0a6"],
      [17, 5, "#ff8fba"],
      [6, 12, "#fff0a6"],
      [12, 12, "#f5a6e8"],
      [15, 8, "#ff8fba"],
      [3, 13, "#fff0a6"]
    ];

    drawFlowers(flowers);

    // Recuerdos
    memories.forEach(memory => {
      if (!collected.has(memory.id)) {
        ctx.font = "22px serif";
        ctx.textAlign = "center";
        ctx.fillText(
          memory.emoji,
          memory.x * TILE + 16,
          memory.y * TILE + 25
        );
      }
    });

    // Isis
    drawGirl(isis.x, isis.y);

    // Puerta del jardín secreto
    ctx.fillStyle = gardenUnlocked ? "#e5a3d0" : "#75415f";
    ctx.fillRect(17 * TILE + 4, 7 * TILE + 3, 24, 29);

    ctx.fillStyle = "#fff0fa";
    ctx.font = "19px serif";
    ctx.textAlign = "center";
    ctx.fillText(
      gardenUnlocked ? "♥" : "🔒",
      17 * TILE + 16,
      7 * TILE + 23
    );

    // Portal final
    if (collected.size === memories.length) {
      ctx.fillStyle = "#ff7ac5";
      ctx.fillRect(17 * TILE + 4, 12 * TILE + 3, 24, 27);

      ctx.fillStyle = "#fff0fa";
      ctx.fillRect(17 * TILE + 10, 12 * TILE + 9, 12, 15);
    }

    drawBoy(player.x, player.y);
  }

  function showDialogue(title, text, callback) {
    dialogueTitle.textContent = title;
    dialogueText.textContent = text;

    answerContainer.replaceChildren();
    answerContainer.style.display = "none";

    dialogueButton.hidden = false;
    dialogueButton.textContent = "CONTINUAR";

    dialogue.hidden = false;
    dialogueOpen = true;
    dialogueCallback = callback || null;
  }

  function closeDialogue() {
    dialogue.hidden = true;
    dialogueOpen = false;
    answerContainer.replaceChildren();

    if (dialogueCallback) {
      const callback = dialogueCallback;
      dialogueCallback = null;
      callback();
    }
  }

  function showQuestion() {
    const current = questions[quizIndex];

    dialogueTitle.textContent =
      `🔐 PREGUNTA ${quizIndex + 1} DE 3`;

    dialogueText.textContent = current.question;

    dialogueButton.hidden = true;
    answerContainer.replaceChildren();
    answerContainer.style.display = "flex";

    current.answers.forEach((answer, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = answer;
      button.style.padding = "12px";
      button.style.border = "2px solid #ffacd9";
      button.style.background = "#382344";
      button.style.color = "#fff0fa";
      button.style.font = "inherit";
      button.style.cursor = "pointer";
      button.style.borderRadius = "8px";

      button.addEventListener("click", function () {
        if (index === current.correct) {
          quizIndex++;

          if (quizIndex === questions.length) {
            gardenUnlocked = true;

            answerContainer.replaceChildren();
            answerContainer.style.display = "none";

            dialogueTitle.textContent = "🌷 ¡JARDÍN DESBLOQUEADO!";
            dialogueText.textContent =
              "¡Has acertado las tres preguntas! La puerta se ha abierto. Bienvenido a vuestro jardín secreto, Iker. 💗";

            dialogueButton.hidden = false;
            dialogueButton.textContent = "ENTRAR AL JARDÍN ♥";
            dialogueCallback = function () {
              enterGarden();
            };
          } else {
            showQuestion();
          }
        } else {
          dialogueText.textContent =
            "¡Uy! Esa no es la respuesta. ¡Inténtalo otra vez! 💗";
        }
      });

      answerContainer.appendChild(button);
    });
  }

  function startQuiz() {
    quizIndex = 0;
    dialogueOpen = true;
    dialogue.hidden = false;
    dialogueCallback = null;
    showQuestion();
  }

  function enterGarden() {
    inGarden = true;
    player.x = 2;
    player.y = 7;

    gameMessage.textContent =
      "🌷 Has entrado en vuestro jardín secreto. Explora y disfruta.";

    drawWorld();
  }

  function leaveGarden() {
    inGarden = false;
    player.x = 16;
    player.y = 7;

    gameMessage.textContent =
      "Has vuelto al bosque. ¡Sigue explorando! 💗";

    drawWorld();
  }

  function collectMemory(memory) {
    collected.add(memory.id);
    updateCounter();

    showDialogue(memory.emoji + " " + memory.title, memory.text);

    if (collected.size === memories.length) {
      gameMessage.textContent =
        "¡Has encontrado todos los recuerdos! Busca el portal rosa. 💗";
    } else {
      gameMessage.textContent = "¡Has encontrado un recuerdo!";
    }

    drawWorld();
  }

  function movePlayer(dx, dy) {
    if (!gameStarted || dialogueOpen) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (inGarden) {
      if (newX < 1 || newY < 1 || newX > 18 || newY > 13) {
        return;
      }
    } else if (isWall(newX, newY)) {
      return;
    }

    if (dx > 0) playerAnimation.direction = "right";
    else if (dx < 0) playerAnimation.direction = "left";
    else if (dy > 0) playerAnimation.direction = "down";
    else if (dy < 0) playerAnimation.direction = "up";

    playerAnimation.frame = (playerAnimation.frame + 1) % 2;

    player.x = newX;
    player.y = newY;

    if (!inGarden) {
      const lemon = memories.find(memory => memory.id === "lemon");

      if (
        lemon &&
        !collected.has(lemon.id) &&
        player.x === lemon.x &&
        player.y === lemon.y
      ) {
        collectMemory(lemon);
      }
    }

    drawWorld();
  }

  function interact() {
    if (!gameStarted || dialogueOpen) return;

    if (inGarden) {
      const exitDistance =
        Math.abs(player.x - 1) + Math.abs(player.y - 7);

      if (exitDistance <= 1) {
        leaveGarden();
      } else {
        gameMessage.textContent =
          "Explora vuestro jardín secreto. 🌷";
      }
      return;
    }

    const memory = memories.find(memory => {
      if (collected.has(memory.id)) return false;

      const distance =
        Math.abs(player.x - memory.x) +
        Math.abs(player.y - memory.y);

      return distance <= 1;
    });

    if (memory) {
      collectMemory(memory);
      return;
    }

    const distanceToIsis =
      Math.abs(player.x - isis.x) +
      Math.abs(player.y - isis.y);

    if (distanceToIsis <= 1) {
      showDialogue(
        "💗 ISIS",
        "¡Hola, Iker! Sigue explorando. Todavía quedan recuerdos por encontrar."
      );
      return;
    }

    const distanceToGarden =
      Math.abs(player.x - 17) + Math.abs(player.y - 7);

    if (distanceToGarden <= 1) {
      if (!gardenUnlocked) {
        startQuiz();
      } else {
        enterGarden();
      }
      return;
    }

    const distanceToPortal =
      Math.abs(player.x - 17) + Math.abs(player.y - 12);

    if (
      collected.size === memories.length &&
      distanceToPortal <= 1
    ) {
      showDialogue(
        "❤️ EL FINAL DE ESTA AVENTURA",
        "Para mi Amor, para Iker. Gracias por cada recuerdo, cada risa y cada momento compartido. Con cariño, Isis. Esta historia todavía tiene muchos capítulos por escribir. Te quiero 3000. 💗",
        function () {
          gameMessage.textContent = "¡AVENTURA COMPLETADA!";
        }
      );
      return;
    }

    gameMessage.textContent =
      "No hay nada con lo que interactuar cerca. Explora un poquito más.";
  }

  function startGame() {
    gameStarted = true;
    inGarden = false;
    player.x = 2;
    player.y = 2;

    playerAnimation.direction = "down";
    playerAnimation.frame = 0;

    collected.clear();
    gardenUnlocked = false;
    updateCounter();

    startScreen.hidden = true;
    gameScreen.hidden = false;

    gameMessage.textContent = "¡Encuentra el limón! 🍋";

    drawWorld();
  }

  startButton.addEventListener("click", startGame);
  dialogueButton.addEventListener("click", closeDialogue);
  interactButton.addEventListener("click", interact);

  document.querySelectorAll("[data-move]").forEach(button => {
    button.addEventListener("click", function () {
      const moves = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0]
      };

      const direction = button.dataset.move;
      movePlayer(...moves[direction]);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (!gameStarted || dialogueOpen) return;

    const key = event.key.toLowerCase();

    const moves = {
      arrowup: [0, -1],
      w: [0, -1],
      arrowdown: [0, 1],
      s: [0, 1],
      arrowleft: [-1, 0],
      a: [-1, 0],
      arrowright: [1, 0],
      d: [1, 0]
    };

    if (key === "e" || key === " ") {
      event.preventDefault();
      interact();
      return;
    }

    if (moves[key]) {
      event.preventDefault();

      if (!event.repeat) {
        movePlayer(...moves[key]);
      }
    }
  });

  updateCounter();
  drawWorld();
});
