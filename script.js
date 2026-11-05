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

const player = {
  x: 2,
  y: 2
};

const isis = {
  x: 9,
  y: 7
};

const memories = [
  {
    id: "lemon",
    x: 16,
    y: 3,
    emoji: "🍋",
    title: "EL LIMÓN DEL DESTINO",
    text: "14 de febrero de 2025. En las escaleras del instituto, Iker le regaló un limón a Isis. Ella lo guardó en su estuche y lo conservó. Iker todavía no sabía lo mucho que le gustaban los limones. Aquel pequeño regalo terminó siendo el comienzo de vuestra historia."
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
    text: "¡A UN CREEPER! Isis gritó la advertencia en Minecraft, pero se quedó quieta. ¡Y el creeper ganó! Una misión que merece quedar para la historia. "
  },
  {
    id: "naruto",
    x: 10,
    y: 3,
    emoji: "🍥",
    title: "MISIÓN NARUTO",
    text: "Isis empezó a descubrir el anime favorito de Iker. Poco a poco, Naruto se convirtió en otra aventura que podían compartir."
  }
];

const collected = new Set();

let gameStarted = false;
let dialogueOpen = false;
let dialogueCallback = null;

function isWall(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) {
    return true;
  }

  return map[y][x] === "#";
}

function updateCounter() {
  memoryCounter.textContent = `RECUERDOS: ${collected.size}/4`;
}

function drawTile(x, y) {
  const wall = map[y][x] === "#";

  if (wall) {
    ctx.fillStyle = "#765080";
    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

    ctx.fillStyle = "#9b6ba0";
    ctx.fillRect(x * TILE, y * TILE, TILE, 7);
    ctx.fillRect(x * TILE, y * TILE, 7, TILE);
  } else {
    ctx.fillStyle = (x + y) % 2 === 0 ? "#91c879" : "#88bd70";
    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

    ctx.fillStyle = "#a8d98b";
    ctx.fillRect(x * TILE + 5, y * TILE + 7, 3, 3);
    ctx.fillRect(x * TILE + 22, y * TILE + 20, 3, 3);
  }
}

function drawBoy(x, y) {
  const px = x * TILE;
  const py = y * TILE;

  // Pelo rizado
  ctx.fillStyle = "#17121b";
  ctx.fillRect(px + 8, py + 3, 16, 7);
  ctx.fillRect(px + 5, py + 7, 22, 7);
  ctx.fillRect(px + 8, py + 5, 4, 4);
  ctx.fillRect(px + 17, py + 3, 4, 4);

  // Cara
  ctx.fillStyle = "#713e2b";
  ctx.fillRect(px + 8, py + 11, 16, 12);

  // Ojos
  ctx.fillStyle = "#17121b";
  ctx.fillRect(px + 12, py + 15, 2, 2);
  ctx.fillRect(px + 19, py + 15, 2, 2);

  // Camiseta blanca
  ctx.fillStyle = "#fff7f1";
  ctx.fillRect(px + 7, py + 23, 18, 5);

  // Pantalones negros
  ctx.fillStyle = "#21152f";
  ctx.fillRect(px + 8, py + 28, 7, 4);
  ctx.fillRect(px + 17, py + 28, 7, 4);
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

  // Camiseta blanca
  ctx.fillStyle = "#fff7f1";
  ctx.fillRect(px + 8, py + 23, 16, 5);

  // Vaqueros azules
  ctx.fillStyle = "#426eb3";
  ctx.fillRect(px + 9, py + 28, 6, 4);
  ctx.fillRect(px + 17, py + 28, 6, 4);
}

function drawWorld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      drawTile(x, y);
    }
  }

  // Recuerdos que todavía no se han encontrado
  memories.forEach(memory => {
    if (!collected.has(memory.id)) {
      ctx.font = "22px serif";
      ctx.textAlign = "center";
      ctx.fillText(
        memory.emoji,
        memory.x * TILE + TILE / 2,
        memory.y * TILE + 25
      );
    }
  });

  // Isis
  drawGirl(isis.x, isis.y);

  // Portal final
  if (collected.size === memories.length) {
    ctx.fillStyle = "#ff7ac5";
    ctx.fillRect(17 * TILE + 4, 12 * TILE + 3, 24, 27);

    ctx.fillStyle = "#fff0fa";
    ctx.fillRect(17 * TILE + 10, 12 * TILE + 9, 12, 15);

    ctx.font = "16px serif";
    ctx.textAlign = "center";
    ctx.fillText("♥", 17 * TILE + 16, 12 * TILE + 21);
  }

  // Iker
  drawBoy(player.x, player.y);
}

function showDialogue(title, text, callback) {
  dialogueTitle.textContent = title;
  dialogueText.textContent = text;
  dialogue.hidden = false;
  dialogueOpen = true;
  dialogueCallback = callback || null;
  drawWorld();
}

function closeDialogue() {
  dialogue.hidden = true;
  dialogueOpen = false;

  if (dialogueCallback) {
    const callback = dialogueCallback;
    dialogueCallback = null;
    callback();
  }

  drawWorld();
}

function movePlayer(dx, dy) {
  if (!gameStarted || dialogueOpen) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (isWall(newX, newY)) return;

  player.x = newX;
  player.y = newY;

  // Recoger el limón automáticamente al pisarlo
  const lemon = memories.find(memory => memory.id === "lemon");

  if (
    lemon &&
    !collected.has("lemon") &&
    player.x === lemon.x &&
    player.y === lemon.y
  ) {
    collected.add("lemon");
    updateCounter();

    showDialogue(
      "🍋 " + lemon.title,
      lemon.text
    );
  }

  drawWorld();
}

function findNearbyMemory() {
  return memories.find(memory => {
    if (collected.has(memory.id)) return false;

    const distance =
      Math.abs(player.x - memory.x) +
      Math.abs(player.y - memory.y);

    return distance <= 1;
  });
}

function interact() {
  if (!gameStarted || dialogueOpen) return;

  const memory = findNearbyMemory();

  if (memory) {
    collected.add(memory.id);
    updateCounter();

    showDialogue(
      memory.emoji + " " + memory.title,
      memory.text
    );

    if (collected.size === memories.length) {
      gameMessage.textContent = "¡Has encontrado todos los recuerdos! Busca el portal rosa. 💗";
    } else {
      gameMessage.textContent = "¡Un recuerdo más descubierto!";
    }

    drawWorld();
    return;
  }

  const distanceToIsis =
    Math.abs(player.x - isis.x) +
    Math.abs(player.y - isis.y);

  if (distanceToIsis <= 1) {
    showDialogue(
      "💗 ISIS",
      "¡Hola, Iker! Has venido a descubrir nuestra historia. Sigue explorando, todavía quedan recuerdos por encontrar."
    );
    return;
  }

  if (
    collected.size === memories.length &&
    Math.abs(player.x - 17) + Math.abs(player.y - 12) <= 1
  ) {
    showDialogue(
      "❤️ EL FINAL DE ESTA AVENTURA",
      "Para mi Amor, para Iker. Gracias por cada recuerdo, cada risa y cada momento compartido. Con cariño, Isis. Esta historia todavía tiene muchos capítulos por escribir. Te quiero 3000. 💗",
      () => {
        gameMessage.textContent = "¡AVENTURA COMPLETADA!";
      }
    );
    return;
  }

  gameMessage.textContent = "No hay nada con lo que interactuar cerca. Explora un poquito más.";
}

function startGame() {
  gameStarted = true;
  startScreen.hidden = true;
  gameScreen.hidden = false;

  player.x = 2;
  player.y = 2;
  collected.clear();

  updateCounter();
  gameMessage.textContent = "¡Encuentra el limón! 🍋";
  drawWorld();
}

function restartGame() {
  dialogue.hidden = true;
  dialogueOpen = false;
  gameStarted = false;
  startScreen.hidden = false;
  gameScreen.hidden = true;
  player.x = 2;
  player.y = 2;
  collected.clear();
  updateCounter();
}

startButton.addEventListener("click", startGame);
dialogueButton.addEventListener("click", closeDialogue);
document.getElementById("interactButton").addEventListener("click", interact);

document.querySelectorAll("[data-move]").forEach(button => {
  button.addEventListener("click", () => {
    const direction = button.dataset.move;

    const moves = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0]
    };

    movePlayer(...moves[direction]);
  });
});

document.addEventListener("keydown", event => {
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

drawWorld();
