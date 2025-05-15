function Game() {
    this.viewX = 0;
    this.viewY = 0;
    this.canvas = document.getElementById("GameCanvas");
    this.ctx = this.canvas.getContext("2d");
	//il <div> che contiene l'elemento canvas
	this.resizeCanvas = function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }.bind(this);

    // Funzione per richiedere fullscreen
    this.goFullscreen = function() {
        if (this.canvas.requestFullscreen) {
            this.canvas.requestFullscreen();
        } else if (this.canvas.mozRequestFullScreen) { // Firefox
            this.canvas.mozRequestFullScreen();
        } else if (this.canvas.webkitRequestFullscreen) { // Chrome, Safari, Opera
            this.canvas.webkitRequestFullscreen();
        } else if (this.canvas.msRequestFullscreen) { // IE/Edge
            this.canvas.msRequestFullscreen();
        }
    }.bind(this);

    // Chiamata iniziale per impostare le dimensioni corrette
    this.resizeCanvas();

	//nasconde il cursore
	this.canvas.style.cursor = "none";

    // Carica l'immagine
    this.image = new Image();
    this.image.src = "livello_0.png";

    this.Draw = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let scaleFactor = Math.min(this.canvas.width / this.image.width, this.canvas.height / this.image.height);
        let imageWidth = this.image.width * scaleFactor;
        let imageHeight = this.image.height * scaleFactor;
        let x = (this.canvas.width - imageWidth) / 2;
        let y = (this.canvas.height - imageHeight) / 2;

        this.ctx.drawImage(this.image, x, y, imageWidth, imageHeight);
    };

    this.image.onload = () => this.Draw();

	if(!this.ctx){
		alert("Il tuo browser non supporta HTML5, aggiornalo!");
	}
    this.GameLoop = function() {
		if(!this.paused) {
			// aggiorna tutti gli oggetti
			this.Update();
		}
		//disegna l'intera scena a schermo
		this.Draw();
		window.requestAnimFrame(function() {
			// rilancia la funzione GameLoop ad ogni frame
			game.GameLoop();
		});
        Inputs.Clear();
        this.EndLoop = function(){
            if(this.level > 0){
                this.player.UpdateAnimation();
            }
        }
        this.GameLoop = function() {
            //..
            this.Draw();
            this.EndLoop();
            //..
        }
	}
}
function StartGame(){
	//crea un istanza di Game
	game = new Game();
}
rh = new ResourcesHandler( function() {
	game.LoadLevel(0);
	game.GameLoop();
});
// Ricordiamo la sintassi di LoadSprite:
// ResourceHandler.LoadSprite(src, subimages, callback);
this.sprLogo        = rh.LoadSprite("img/logo.png",1);
this.sprSplashLogo  = rh.LoadSprite("img/splashLogo.png",1);
//cursore del mouse
this.sprCursor = rh.LoadSprite("img/cursor.png",1); 
this.backgroundMenu = rh.LoadSprite("img/backgroundmenu.png", 1, function() {
	game.patternMenu = game.ctx.createPattern(game.backgroundMenu,"repeat");
});
this.sndMusic = rh.LoadSound("audio/datagrove",["ogg", "mp3"]);
this.ResetLevel = function() {
	this.mainMenu = null;
	this.levelCompleted = null;
	this.score = 0;
    this.player = null;
}
this.LoadLevel = function(lev) {
	this.level = lev;
	this.ResetLevel();
	if(lev == 0) {
		this.mainMenu = new MainMenu();
	}
	else {
		this.player = new Player();
	}
}
this.Draw = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	if(lev == 0) {
		//menu principale
		this.mainMenu.Draw();
	}
	else {
		this.ctx.drawImage(this.background1, 0, 0, this.canvas.width, this.canvas.height);
		//livello di gioco
		this.player.Draw();
	}
	//disegna il cursore
	game.ctx.drawImage(game.sprCursor, Inputs.mouseX - game.sprCursor.width/2, Inputs.mouseY - game.sprCursor.height/2);
}
this.Update = function(){
    if(Inputs.GetKeyDown(KEY_RIGHT)) {
		//...
	}
	else if(Inputs.GetKeyDown(KEY_LEFT)) {
		//...
	}
	else{
		//x...
		if(Math.abs(this.hSpeed) < 1) {
			// ...
			//imposto lo sprite del personaggio fermo
			this.sprite = game.sprPlayerIdle;
			this.curFrame = 0;
		}
	}
	//...
	if(this.hSpeed != 0) {
		// sposto il player
		this.x += hSpeed;
		// orientamento orizzontale dello sprite
		this.scaling = (this.hSpeed < 0) ? -1 : 1; 
		//cambio sprite
		if(this.sprite != game.sprPlayerRun) {
			this.sprite = game.sprPlayerRun;
			this.curFrame = 0;
		}
		this.animSpeed = 0.1 + Math.abs( this.hSpeed / this.maxSpeed * 0.12);
	}
}
//ResourceHandler.LoadSprite(src, subimages, callback);
this.sprPlayerIdle     = rh.LoadSprite("img/playerIdle.png",2);
this.sprPlayerIdleShot = rh.LoadSprite("img/playerShot.png",1);
this.sprPlayerRun      = rh.LoadSprite("img/playerRun.png",6);
this.sprPlayerJump     = rh.LoadSprite("img/playerJump.png",1);
this.sprPlayerJumpShot = rh.LoadSprite("img/playerJumpShot.png",1);
this.sprPlayerFall     = rh.LoadSprite("img/playerFall.png",1);
this.sprPlayerFallShot = rh.LoadSprite("img/playerFallShot.png",1);
this.background1       = rh.LoadSprite("img/sky.png", 1);

function Player(){
    this.maxSpeed = 5;
    this.hSpeed = 0;
    this.vSpeed = 0;
	this.sprite = game.sprPlayerRun;
	this.curFrame = 0;
	this.animSpeed = 0.2;
	this.width = this.sprite.w;
	this.height = this.sprite.height;
	this.xStart = game.canvas.width/2;
	this.yStart = game.canvas.height/2-60;
	this.x = this.xStart;
	this.y = this.yStart;
	this.xOffset = Math.floor(this.width/2);
	this.yOffset = this.height;
	this.Draw = function(){
		game.ctx.save();
		game.ctx.translate(this.x-game.viewX,this.y-game.viewY);
		game.ctx.scale(this.scaling, 1);
		var ox = Math.floor(this.curFrame) * this.width;
		game.ctx.drawImage(this.sprite, ox, 0,
		                   this.sprite.w, this.sprite.height,
						   -this.xOffset, -this.yOffset,
						   this.sprite.w, this.sprite.height); 
		game.ctx.restore();
	}
    this.Update = function() {
        if(Inputs.GetKeyDown(KEY_RIGHT)) {
            if(this.hSpeed < 0) this.hSpeed = 0;
            if(this.hSpeed < this.maxSpeed) this.hSpeed += 0.4;
        }
        else if(Inputs.GetKeyDown(KEY_LEFT)) {
            if(this.hSpeed > 0) this.hSpeed = 0;
            if(this.hSpeed > -this.maxSpeed) this.hSpeed -= 0.4;
        }
        else{
            this.hSpeed/=1.1;
            if(Math.abs(this.hSpeed) < 1) {
                this.hSpeed = 0;
            }
        }
        if(this.hSpeed != 0){
            // sposto il player
            this.x += this.hSpeed;
        }
        this.Update = function() {
            if(this.level > 0) {
                this.player.Update();
            }
        }
        this.UpdateAnimation = function() {
            this.curFrame += this.animSpeed;
            if(this.animSpeed > 0) {
                var diff = this.curFrame - this.sprite.frames;
                if(diff >= 0){
                    this.curFrame = diff;
                }
            }
            else if(this.curFrame < 0){
                this.curFrame = (this.sprite.frames + this.curFrame) - 0.0000001;
            }
        }
    }
}