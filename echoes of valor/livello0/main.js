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
  this.keys = {};

  // Resize canvas to fill the window
  this.resizeCanvas = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  this.resizeCanvas(); // <-- Inizializza correttamente la canvas subito

  // Carica le immagini
  const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  this.loadAssets = async function (callback) {
    try {
      await Promise.all([
        loadImage("Personaggi_Gioco/Idle.png"),
        loadImage("Personaggi_Gioco/Run.png"),
        loadImage("Personaggi_Gioco/RunBack.png"),
        loadImage("Personaggi_Gioco/Jump.png"),
        loadImage("Personaggi_Gioco/JumpBack.png"),
        loadImage("Personaggi_Gioco/Attack_1.png"),
        loadImage("Personaggi_Gioco/Attack_2.png"),
        loadImage("Personaggi_Gioco/Attack_3.png"),
        loadImage("Personaggi_Gioco/AttackBack_1.png"),
        loadImage("Personaggi_Gioco/AttackBack_2.png"),
        loadImage("Personaggi_Gioco/AttackBack_3.png"),
        loadImage("livello_0.png")
      ]);

      console.log("All images loaded");

      this.sprPlayerIdle = new Image();
      this.sprPlayerIdle.src = "Personaggi_Gioco/Idle.png";
      this.sprPlayerRun = new Image();
      this.sprPlayerRun.src = "Personaggi_Gioco/Run.png";
      this.sprPlayerRunBack = new Image();
      this.sprPlayerRunBack.src = "Personaggi_Gioco/RunBack.png";
      this.sprPlayerJump = new Image();
      this.sprPlayerJump.src = "Personaggi_Gioco/Jump.png";
      this.sprPlayerJumpBack = new Image();
      this.sprPlayerJumpBack.src = "Personaggi_Gioco/JumpBack.png";
      this.sprAttack1 = new Image();
      this.sprAttack1.src = "Personaggi_Gioco/Attack_1.png";
      this.sprAttack2 = new Image();
      this.sprAttack2.src = "Personaggi_Gioco/Attack_2.png";
      this.sprAttack3 = new Image();
      this.sprAttack3.src = "Personaggi_Gioco/Attack_3.png";
      this.sprAttackBack1 = new Image();
      this.sprAttackBack1.src = "Personaggi_Gioco/AttackBack_1.png";
      this.sprAttackBack2 = new Image();
      this.sprAttackBack2.src = "Personaggi_Gioco/AttackBack_2.png";
      this.sprAttackBack3 = new Image();
      this.sprAttackBack3.src = "Personaggi_Gioco/AttackBack_3.png";
      this.background1 = new Image();
      this.background1.src = "livello_0.png";

      this.player = new Player(
        this.sprPlayerIdle,
        this.sprPlayerRun,
        this.sprPlayerRunBack,
        this.sprPlayerJump,
        this.sprPlayerJumpBack,
        this.sprAttack1,
        this.sprAttack2,
        this.sprAttack3,
        this.sprAttackBack1,
        this.sprAttackBack2,
        this.sprAttackBack3
      );

      callback();
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  this.GameLoop = () => {
    if (this.player) {
      this.player.Update();
    }
    this.Draw();
    window.requestAnimationFrame(this.GameLoop);
  };

  this.Draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.background1, 0, 0, this.canvas.width, this.canvas.height);
    if (this.player) {
      this.player.Draw(this.ctx);
    }
  };

  this.hidePreLoader = function () {
    const preLoader = document.getElementById('preLoader');
    if (preLoader) {
      setTimeout(() => {
        preLoader.classList.add('hidden');
      }, 500);
    }
  };

  this.StartGame = function () {
    this.loadAssets(() => {
      this.hidePreLoader();
      this.GameLoop();
    });
  };

  // Aggiungi l'ascoltatore per il clic del mouse
  let attackCounter = 0;
  window.addEventListener('click', (event) => {
    if (this.player) {
      attackCounter = (attackCounter + 1) % 3;  // cicla attraverso gli attacchi
      this.player.handleMouseClick(attackCounter);
    }
  });

  window.addEventListener("keydown", (e) => {
    this.keys[e.key] = true;
  });

  window.addEventListener("keyup", (e) => {
    this.keys[e.key] = false;
  });
}

let game = new Game();
game.StartGame();
