// Game Constructor
function Game() {
  this.cellSize = 32;
  this.viewX = 0;
  this.viewY = 0;
  this.canvas = document.getElementById("GameCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.tiles = [];
  this.blocks = [];
  this.player = null;
  this.gravity = 0.4;

  this.resizeCanvas = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  this.goFullscreen = function () {
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen();
    } else if (this.canvas.mozRequestFullScreen) { // Firefox
      this.canvas.mozRequestFullScreen();
    } else if (this.canvas.webkitRequestFullscreen) { // Chrome, Safari, Opera
      this.canvas.webkitRequestFullscreen();
    } else if (this.canvas.msRequestFullscreen) { // IE/Edge
      this.canvas.msRequestFullscreen();
    }
  };

  this.resizeCanvas();

  this.loadAssets = function () {
    this.sprPlayerRun = new Image();
    this.sprPlayerRun.src = "Personaggi_Gioco/Run.png";

    this.background1 = new Image();
    this.background1.src = "img/livello_0.png";
    
    this.background1.onload = () => {
      this.GameLoop();
    };
  };

  this.GameLoop = function () {
    if (this.player) {
      this.player.Update();
    }

    this.Draw();
    window.requestAnimationFrame(this.GameLoop.bind(this));
  };

  this.Draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.background1, 0, 0, this.canvas.width, this.canvas.height);
    if (this.player) {
      this.player.Draw();
    }
  };

  this.StartGame = function () {
    this.loadAssets();
    this.player = new Player(this);
  };
}

// Initialize the game
let game = new Game();
game.StartGame();