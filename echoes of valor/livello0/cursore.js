const canvas = document.getElementById("GameCanvas");
canvas.addEventListener('click', function () {
  if (game.player) {
    game.player.handleMouseClick();
  }
});
canvas.style.cursor = 'none';
