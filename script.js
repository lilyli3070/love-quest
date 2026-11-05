
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
  const screen = document.querySelector(".screen");

  screen.innerHTML = `
    <div class="pixel-heart">♥</div>
    <p class="subtitle">LEVEL 1</p>
    <h1>WELCOME!</h1>
    <p class="intro">
      Esta aventura ha sido creada especialmente para ti.
      <br><br>
      ¿Estás preparado para descubrir todos los secretos?
    </p>
    <div class="pixel-character">♡</div>
    <button id="continueButton">CONTINUAR ♥</button>
    <p class="footer">LOVE QUEST · 2026</p>
  `;

  document.getElementById("continueButton").addEventListener("click", function() {
    screen.innerHTML = `
      <div class="pixel-heart">♥</div>
      <h1>UNA AVENTURA TE ESPERA</h1>
      <p class="intro">
        Cada nivel es un recuerdo.
        Cada prueba es una sorpresa.
        Y el final... es solo nuestro.
      </p>
      <p class="pixel-character">♡</p>
      <p class="footer">TO BE CONTINUED...</p>
    `;
  });
});
