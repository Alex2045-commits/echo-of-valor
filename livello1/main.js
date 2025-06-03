function Game() {
  this.cellSize = 32;
  this.viewX = 0;
  this.viewY = 0;
  this.canvas = document.getElementById("GameCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.tiles = [];
  this.blocks = [];
  this.player = null;
  this.monster = null;
  this.secondMonster = null; // nuovo mostro
  this.gravity = 0.4;
  this.backgroundMusic = new Audio("suono.mp3");
  this.backgroundMusic.loop = true;
  this.backgroundMusic.volume = 0.5; // Opzionale: regola il volume (da 0 a 1)
  this.keys = {};
  

  // Contatori per il respawn del mostro
  this.monsterSpawnCount = 1; // Primo mostro già presente
  this.maxMonsters = 4;       // Totale mostri da far apparire
  this.nextMonsterSpawnTime = null;

  // Variabile per spawnare il secondo mostro dopo 5 secondi
  this.secondMonsterSpawned = false;
  
  this.startTime = Date.now();

  // Nuove immagini dei cuori
  this.heart3 = new Image();
  this.heart2 = new Image();
  this.heart1 = new Image();
  this.heart0 = new Image();

  // Immagine per Game Over
  this.gameOverImage = new Image();

  // **Punteggio**
  this.score = 0;

  this.customCursor = new Image();
  this.customCursor.src = "img/cursore.png";  // Percorso dell'immagine del cursore

  const cursorElement = document.createElement('img');
  cursorElement.classList.add('custom-cursor');
  cursorElement.src = this.customCursor.src;
  document.body.appendChild(cursorElement);

  // Funzione per aggiornare la posizione del cursore
  this.updateCursorPosition = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Posiziona il cursore all'angolo superiore sinistro del mouse
    cursorElement.style.left = `${mouseX - cursorElement.width / 2}px`;
    cursorElement.style.top = `${mouseY - cursorElement.height / 2}px`;
    cursorElement.style.display = 'block';  // Mostra il cursore
  };

  // Ascolta gli eventi del mouse
  window.addEventListener('mousemove', this.updateCursorPosition);

  // Funzione per nascondere il cursore quando il gioco è in pausa
  this.togglePause = function() {
    this.paused = !this.paused;
    if (!this.paused) {
      // Riprendi il gioco, cancella eventuali interruzioni
      this.startTime = Date.now() - (this.startTime - this.nextMonsterSpawnTime); // Riavvia il cronometro
      this.GameLoop();  // Riprendi il ciclo di gioco se è stato fermato
    }
  };

  this.resizeCanvas = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  this.resizeCanvas();
  window.addEventListener('resize', this.resizeCanvas.bind(this));

  const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
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
        loadImage("Personaggi_Gioco/Hurt.png"),
        loadImage("Personaggi_Gioco/Dead.png"),
        loadImage("livello1.png"),
        loadImage("Primo_Mostro/Idle.png"),
        loadImage("Primo_Mostro/Walk.png"),
        loadImage("Primo_Mostro/Run.png"),
        loadImage("Primo_Mostro/Attack_1.png"),
        loadImage("Primo_Mostro/Attack_2.png"),
        loadImage("Primo_Mostro/Attack_3.png"),
        loadImage("Primo_Mostro/Dead.png"),

        // Immagini Secondo Mostro
        loadImage("Secondo_Mostro/Idle.png"),
        loadImage("Secondo_Mostro/Walk.png"),
        loadImage("Secondo_Mostro/Run.png"),
        loadImage("Secondo_Mostro/Attack_1.png"),
        loadImage("Secondo_Mostro/Attack_2.png"),
        loadImage("Secondo_Mostro/Attack_3.png"),
        loadImage("Secondo_Mostro/Dead.png"),

        // Cuori
        loadImage("CuoriGioco/3cuori.png"),
        loadImage("CuoriGioco/2cuori.png"),
        loadImage("CuoriGioco/1cuore.png"),
        loadImage("CuoriGioco/0cuori.png"),

        // Game Over
        loadImage("img/gameOver.png"),
      ]);

      // Assegnazione immagini cuori e game over (puoi rimuovere se non usi altrove)
      this.heart3.src = "CuoriGioco/3cuori.png";
      this.heart2.src = "CuoriGioco/2cuori.png";
      this.heart1.src = "CuoriGioco/1cuore.png";
      this.heart0.src = "CuoriGioco/0cuori.png";

      this.gameOverImage.src = "img/gameOver.png";

      // Immagini player
      this.sprPlayerIdle = new Image(); this.sprPlayerIdle.src = "Personaggi_Gioco/Idle.png";
      this.sprPlayerRun = new Image(); this.sprPlayerRun.src = "Personaggi_Gioco/Run.png";
      this.sprPlayerRunBack = new Image(); this.sprPlayerRunBack.src = "Personaggi_Gioco/RunBack.png";
      this.sprPlayerJump = new Image(); this.sprPlayerJump.src = "Personaggi_Gioco/Jump.png";
      this.sprPlayerJumpBack = new Image(); this.sprPlayerJumpBack.src = "Personaggi_Gioco/JumpBack.png";
      this.sprAttack1 = new Image(); this.sprAttack1.src = "Personaggi_Gioco/Attack_1.png";
      this.sprAttack2 = new Image(); this.sprAttack2.src = "Personaggi_Gioco/Attack_2.png";
      this.sprAttack3 = new Image(); this.sprAttack3.src = "Personaggi_Gioco/Attack_3.png";
      this.sprAttackBack1 = new Image(); this.sprAttackBack1.src = "Personaggi_Gioco/AttackBack_1.png";
      this.sprAttackBack2 = new Image(); this.sprAttackBack2.src = "Personaggi_Gioco/AttackBack_2.png";
      this.sprAttackBack3 = new Image(); this.sprAttackBack3.src = "Personaggi_Gioco/AttackBack_3.png";
      this.sprPlayerHurt = new Image(); this.sprPlayerHurt.src = "Personaggi_Gioco/Hurt.png";
      this.sprPlayerDead = new Image(); this.sprPlayerDead.src = "Personaggi_Gioco/Dead.png";
      this.background1 = new Image(); this.background1.src = "livello1.png";

      // Primo mostro
      this.sprMonsterIdle = new Image(); this.sprMonsterIdle.src = "Primo_Mostro/Idle.png";
      this.sprMonsterWalk = new Image(); this.sprMonsterWalk.src = "Primo_Mostro/Walk.png";
      this.sprMonsterRun = new Image(); this.sprMonsterRun.src = "Primo_Mostro/Run.png";
      this.sprMonsterAttack1 = new Image(); this.sprMonsterAttack1.src = "Primo_Mostro/Attack_1.png";
      this.sprMonsterAttack2 = new Image(); this.sprMonsterAttack2.src = "Primo_Mostro/Attack_2.png";
      this.sprMonsterAttack3 = new Image(); this.sprMonsterAttack3.src = "Primo_Mostro/Attack_3.png";
      this.sprMonsterDead = new Image(); this.sprMonsterDead.src = "Primo_Mostro/Dead.png";

      // Secondo mostro
      this.sprSecondMonsterIdle = new Image(); this.sprSecondMonsterIdle.src = "Secondo_Mostro/Idle.png";
      this.sprSecondMonsterWalk = new Image(); this.sprSecondMonsterWalk.src = "Secondo_Mostro/Walk.png";
      this.sprSecondMonsterRun = new Image(); this.sprSecondMonsterRun.src = "Secondo_Mostro/Run.png";
      this.sprSecondMonsterAttack1 = new Image(); this.sprSecondMonsterAttack1.src = "Secondo_Mostro/Attack_1.png";
      this.sprSecondMonsterAttack2 = new Image(); this.sprSecondMonsterAttack2.src = "Secondo_Mostro/Attack_2.png";
      this.sprSecondMonsterAttack3 = new Image(); this.sprSecondMonsterAttack3.src = "Secondo_Mostro/Attack_3.png";
      this.sprSecondMonsterDead = new Image(); this.sprSecondMonsterDead.src = "Secondo_Mostro/Dead.png";

      // Inizializza player e primo mostro
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
        this.sprAttackBack3,
        this.sprPlayerHurt,
        this.sprPlayerDead
      );

      this.monster = new Mostro(
        this.sprMonsterIdle,
        this.sprMonsterWalk,
        this.sprMonsterRun,
        this.sprMonsterAttack1,
        this.sprMonsterAttack2,
        this.sprMonsterAttack3,
        this.sprMonsterDead
      );
      this.monster.hasBeenScored = false;

      callback();
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  // Funzione per spawnare il secondo mostro
  this.spawnSecondMonster = function () {
    this.secondMonster = new SecondoMostro(
      this.sprSecondMonsterIdle,
      this.sprSecondMonsterWalk,
      this.sprSecondMonsterRun,
      this.sprSecondMonsterAttack1,
      this.sprSecondMonsterAttack2,
      this.sprSecondMonsterAttack3,
      this.sprSecondMonsterDead
    );
    this.secondMonsterSpawned = true;
  };

  //per far spawnar il mostro di nuovo (primo mostro)
  this.spawnNewMonster = function () {
    this.monster = new Mostro(
      this.sprMonsterIdle,
      this.sprMonsterWalk,
      this.sprMonsterRun,
      this.sprMonsterAttack1,
      this.sprMonsterAttack2,
      this.sprMonsterAttack3,
      this.sprMonsterDead
    );
    this.monster.hasBeenScored = false; // Aggiunto flag per lo scored
    this.monsterSpawnCount++;
  };

  // Funzione per applicare la sfocatura al background
  this.applyBlur = () => {
    this.ctx.filter = 'blur(10px)'; // Aggiungi sfocatura
    this.ctx.drawImage(this.background1, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.filter = 'none'; // Ripristina il filtro
  };

  this.togglePause = function() {
    this.paused = !this.paused;
  };

  this.showPauseMenu = function() {
    this.applyBlur();
    this.ctx.fillStyle = "white";
    this.ctx.font = "60px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("PAUSA", this.canvas.width / 2, this.canvas.height / 2 - 100);

    // Bottone per "Riprendi gioco"
    this.ctx.font = "30px Arial";
    this.ctx.fillText("Riprendi gioco", this.canvas.width / 2, this.canvas.height / 2 + 40);

    // Bottone per "Torna alla schermata Home"
    this.ctx.fillText("Torna alla schermata Home", this.canvas.width / 2, this.canvas.height / 2 + 100);
  };

  let isPaused = false; // Stato globale di pausa

// Funzione che alterna lo stato di pausa del gioco
this.togglePause = function() {
  this.paused = !this.paused;  // Cambia lo stato di pausa
  if (!this.paused) {
    // Riprendi il gioco, cancella eventuali interruzioni
    this.startTime = Date.now() - (this.startTime - this.nextMonsterSpawnTime); // Riavvia il cronometro
    this.GameLoop();  // Riprendi il ciclo di gioco se è stato fermato
  }
};

// Ciclo di gioco principale
this.GameLoop = () => {
  if (this.paused) {
    this.showPauseMenu(); // Mostra il menu di pausa
    return; // Interrompe il ciclo, non aggiorna il gioco
  }

  if (this.player) this.player.Update(); // Aggiorna il gioco se non è in pausa
    // Gestione primo mostro
    if (this.monster) {
      this.monster.Update();

      if (this.monster.shouldRemove) {
        // Incrementa punteggio solo una volta
        if (!this.monster.hasBeenScored) {
          this.score += 10;
          this.monster.hasBeenScored = true;
        }

        // Gestione respawn se non ha raggiunto il massimo
        if (this.monsterSpawnCount < this.maxMonsters) {
          if (!this.nextMonsterSpawnTime) {
            this.nextMonsterSpawnTime = Date.now() + 3000; // aspetta 3 secondi
          } else if (Date.now() >= this.nextMonsterSpawnTime) {
            this.spawnNewMonster(); // Respawn del primo mostro
            this.nextMonsterSpawnTime = null;
          }
        } else {
          // Rimuovi mostro completamente se è l'ultimo
          this.monster = null;
        }
      }
    }

    // Spawn secondo mostro dopo 5 secondi o quando è sconfitto
    if (!this.secondMonsterSpawned && (Date.now() - this.startTime >= 5000)) {
      this.spawnSecondMonster(); // Respawn del secondo mostro se non è ancora apparso
    }

    // Update secondo mostro
    if (this.secondMonster) {
      this.secondMonster.Update();

      if (this.secondMonster.shouldRemove) {
        this.score += 20;
        this.secondMonster = null;

        // Respawn il secondo mostro se il numero massimo non è stato raggiunto
        if (this.monsterSpawnCount < 3) {
          this.spawnSecondMonster(); // Respawn del secondo mostro
        }
      }
    }

    // Disegno
    this.Draw();

    // Fine gioco
    const noMoreFirstMonsters = this.monsterSpawnCount >= this.maxMonsters && !this.monster;
    const secondMonsterDefeated = this.secondMonsterSpawned && !this.secondMonster;

    if (noMoreFirstMonsters && secondMonsterDefeated) {
      console.log("Tutti i mostri sconfitti. Fine del gioco.");
      return;
    }

    window.requestAnimationFrame(this.GameLoop);
  };


  this.Draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.player.isDead) {
      this.applyBlur();
      this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - this.gameOverImage.width / 2, this.canvas.height / 2 - this.gameOverImage.height / 2);
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 5000);
      return;
    }
    
    // Controllo se il gioco è vinto
    const noMoreFirstMonsters = this.monsterSpawnCount >= this.maxMonsters && !this.monster;
    const secondMonsterDefeated = this.secondMonsterSpawned && !this.secondMonster;

    if (noMoreFirstMonsters && secondMonsterDefeated) {
      this.applyBlur();
      this.ctx.fillStyle = "white";
      this.ctx.font = "60px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("YOU WON!!", this.canvas.width / 2, this.canvas.height / 2 - 100);

      // Disegna il bottone per "Torna alla schermata Home"
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Torna alla schermata Home", this.canvas.width / 2, this.canvas.height / 2 + 40);

      // Disegna il bottone per "Next Level"
      this.ctx.fillText("Next Level", this.canvas.width / 2, this.canvas.height / 2 + 100);

      // Aggiungi eventi per i click
      window.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        // Verifica se l'utente ha cliccato sul bottone "Torna alla schermata Home"
        if (clickX >= this.canvas.width / 2 - 150 && clickX <= this.canvas.width / 2 + 150) {
          if (clickY >= this.canvas.height / 2 + 20 && clickY <= this.canvas.height / 2 + 50) {
            window.location.href = "../index.html"; // Torna alla home
          }
        }

        // Verifica se l'utente ha cliccato sul bottone "Next Level"
        if (clickX >= this.canvas.width / 2 - 150 && clickX <= this.canvas.width / 2 + 150) {
          if (clickY >= this.canvas.height / 2 + 80 && clickY <= this.canvas.height / 2 + 110) {
            window.location.href = "../livello2/livello2.html"; // Passa al prossimo livello
          }
        }
      });

      return;
    }

    // Disegna il background
    this.ctx.drawImage(this.background1, 0, 0, this.canvas.width, this.canvas.height);

    // Disegna il player
    if (this.player) {
      this.player.Draw(this.ctx);
    }

    // Allineamento mostro con il player: usa la stessa Y per il mostro
    if (this.monster) {
      const monsterYOffset = this.player.y; // Regola l'offset per abbassarlo un po'
      this.monster.Draw(this.ctx, monsterYOffset);
    }

    // Disegna il secondo mostro con lo stesso approccio
    if (this.secondMonster) {
      const secondMonsterYOffset = this.player.y; // Allineamento verticale anche per il secondo mostro
      this.secondMonster.Draw(this.ctx, secondMonsterYOffset);
    }

    // Cuori salute giocatore
    if (this.player) {
      const heartSize = 475;
      const border = -170;
      const gundam = -150;

      let heartImage;

      if (this.player.health === 3) {
        heartImage = this.heart3;
      } else if (this.player.health === 2) {
        heartImage = this.heart2;
      } else if (this.player.health === 1) {
        heartImage = this.heart1;
      } else {
        heartImage = this.heart0;
      }

      this.ctx.drawImage(heartImage, border, gundam, 700, heartSize);
    }

    // Disegna il punteggio
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.fillText("Punteggio: " + this.score, 20, 40);
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

  let attackCounter = 0;
  window.addEventListener('click', () => {
    if (this.player) {
      attackCounter = (attackCounter + 1) % 3;
      this.player.handleMouseClick(attackCounter);
    }
  });

  window.addEventListener("keydown", (e) => {
    this.keys[e.key] = true;

    // Se si preme uno dei tasti per mettere in pausa
    if (e.key === "Escape" || e.key === "p" || e.key === "Delete") {
      this.togglePause();
    }
  });

  window.addEventListener("keyup", (e) => {
    this.keys[e.key] = false;
  });
  this.canvas.addEventListener('click', () => {
    this.canvas.focus();
  });
  window.addEventListener('click', (e) => {
    if (this.paused) {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Se clicca "Riprendi gioco"
      if (clickX >= this.canvas.width / 2 - 150 && clickX <= this.canvas.width / 2 + 150) {
        if (clickY >= this.canvas.height / 2 + 20 && clickY <= this.canvas.height / 2 + 50) {
          this.togglePause();  // Riprendi il gioco
        }
      }

      // Se clicca "Torna alla schermata Home"
      if (clickX >= this.canvas.width / 2 - 150 && clickX <= this.canvas.width / 2 + 200) {
        if (clickY >= this.canvas.height / 2 + 80 && clickY <= this.canvas.height / 2 + 110) {
          window.location.href = "../index.html";  // Torna alla home
        }
      }
    }
  });
  this.canvas.addEventListener('click', () => {
    if (this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(err => {
        console.warn("Errore nella riproduzione dell'audio:", err);
      });
    }
  });
}

let game = new Game();
game.StartGame();