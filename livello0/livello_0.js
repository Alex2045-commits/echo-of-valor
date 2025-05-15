TOUCH_1 = 1;
MOUSE_LEFT   = 1;
MOUSE_MIDDLE = 2;
MOUSE_RIGHT  = 3;
KEY_LEFT  = 37;
KEY_RIGHT = 39;
KEY_UP    = 38;
KEY_DOWN  = 40;
KEY_ENTER = 13;
KEY_ESC   = 27;
KEY_CTRL  = 17;
KEY_SPACE = 32;

this.maxSpeed = 5;
this.hSpeed = 0;
this.vSpeed = 0;

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
			this.sprite = game.sprPlayerIdle;
			this.curFrame = 0;
		}
	}
	if(this.hSpeed != 0){
		// sposto il player
		this.x += this.hSpeed;
		this.scaling = (this.hSpeed < 0) ? -1 : 1; 
		//cambio sprite
		if(this.sprite != game.sprPlayerRun) {
			this.sprite = game.sprPlayerRun;
			this.curFrame = 0;
		}
		this.animSpeed = 0.1 + Math.abs( this.hSpeed / this.maxSpeed * 0.12);
	}
	//aggiorna tutto
	this.Update = function() {
		if(this.level > 0) {
			this.player.Update();
		}
	}
}

this.Collides = function(b){
	return !(this.x + this.width < b.x || b.x + b.width < this.x ||
  this.y + this.height < b.y || b.y + b.height < this.y);
}

this.CollidesAt = function(b, dx, dy){
	return !(this.x + dx + this.width < b.x || b.x + b.width < this.x + dx || this.y + this.height + dy < b.y || b.y + b.height < this.y + dy);
}
this.CollidesPosition = function(b, x, y){
	return !(x + this.width < b.x || b.x + b.width < x || y + this.height < b.y || b.y + b.height < y);
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

function MainMenu() {
	game.sndMusic.loop = true;
	game.sndMusic.play();
	this.Draw = function() {
	    // disegna lo sfondo
		game.ctx.save();
		game.ctx.fillStyle = game.patternMenu;
		game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
		game.ctx.restore();
		// mostra logo e personaggio
		game.ctx.drawImage(game.sprLogo, game.canvas.width/2 - game.sprLogo.width/2 , 80);
		game.ctx.drawImage(game.sprSplashLogo, 70 , 180);
		game.ctx.shadowColor = "#000";
		game.ctx.shadowOffsetX = 1;
		game.ctx.shadowBlur = 3;
		// imposta il font
		game.ctx.font = "32pt 'PixelFont'"
		game.ctx.textAlign = "center";
		// centro del canvas
		var cx = game.canvas.width/2;
		var cy = game.canvas.height/2;
		// disegna il menu e rileva le azioni dell'utente
		if(Inputs.MouseInsideText("New Game",cx, cy+10,"#eee", "#ea4") && Inputs.GetMousePress(MOUSE_LEFT)) {
			//carica il livello 1
			game.LoadLevel(1);
		}
		if(Inputs.MouseInsideText("Other games",cx, cy+80,"#eee", "#ea4") && Inputs.GetMousePress(MOUSE_LEFT)) {
			window.location.href = "http://google.com";
		}
		game.ctx.shadowOffsetX = 0;
		game.ctx.shadowBlur = 0;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if(this.level == 0) {
			//menu principale
			this.mainMenu.Draw();
		}
		else {
			//disegna il livello di gioco
		}
		//disegna il cursore
		game.ctx.drawImage(game.sprCursor, Inputs.mouseX - game.sprCursor.width/2, Inputs.mouseY - game.sprCursor.height/2);
	}
}

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
		//...
	}
	else{
		this.player = new Player();
	}
}
this.Update = function(){
}

Inputs = function() {}
Inputs.mouseX = 0;
Inputs.mouseY = 0;
Inputs.mouseLeft = false;
Inputs.mouseLeftPress = false;
Inputs.mouseLeftRel = false;
Inputs.mouseRight = false;
Inputs.mouseRightPress = false;
Inputs.mouseRightRel = false;
Inputs.key = [];
Inputs.keyPress = [];
Inputs.keyRel= [];

window.addEventListener("keydown", function(e) {
	if(!Inputs.key[e.keyCode]) {
		Inputs.keyPress[e.keyCode] = true;
		Inputs.key[e.keyCode] = true;
	}
}, false);
window.addEventListener("keyup", function(e) {
	Inputs.keyRel[e.keyCode] = true;
	Inputs.key[e.keyCode] = false;
}, false);

window.addEventListener("mousedown", function(e) {
	switch (e.which) {
		case 1:
			Inputs.mouseLeft = true;
			Inputs.mouseLeftPress = true;
		break;
		case 2:
			Inputs.mouseMiddle = true;
			Inputs.mouseMiddlePress = true;
		break;
		case 3:
			Inputs.mouseRight = true;
			Inputs.mouseRightPress = true;
		break;
	}
}, false);
window.addEventListener("mouseup", function(e) {
	switch (e.which) {
		case 1:
			Inputs.mouseLeft = false;
			Inputs.mouseLeftRel = true;
		break;
		case 2:
			Inputs.mouseMiddle = false;
			Inputs.mouseMiddleRel = true;
		break;
		case 3:
			Inputs.mouseRight = false;
			Inputs.mouseRightRel = true;
		break;
	}
}, false);

window.addEventListener("mousemove", function(e) {
	Inputs.mouseX = Math.round(e.pageX - game.canvas.offsetLeft );
	Inputs.mouseY = Math.round(e.pageY - game.canvas.offsetTop );
	Inputs.mouseMoved = true;
}, false);

window.addEventListener("touchmove", function(s) {
	Inputs.mouseX = Math.round(s.pageX - game.ctx.canvas.offsetLeft );
	Inputs.mouseY = Math.round(s.pageY - game.ctx.canvas.offsetTop );
}, false);
window.addEventListener("touchstart", function(e) {
	Inputs.mouseLeft = true;
	Inputs.mouseLeftPress = true;
}, false);
window.addEventListener("touchend", function() {
	Inputs.mouseLeft = false;
	Inputs.mouseLeftRel = true;
}, false);

Inputs.Clear = function() {
	Inputs.mouseLeftPress = false;
	Inputs.mouseLeftRel   = false;
	Inputs.mouseMiddlePress = false;
	Inputs.mouseMiddleRel   = false;
	Inputs.mouseRightPress = false;
	Inputs.mouseRightRel   = false;
	Inputs.mouseMoved = false;
	Inputs.keyPress = [];
	Inputs.keyRel   = [];
}

Inputs.GetKeyDown = function(k) {
	if(typeof(k) == "string") {
		k = k.charCodeAt(0);
	}
	return (Inputs.key[k] == true);
}
Inputs.GetKeyPress = function(k) {
	if(typeof(k) == "string") {
		k = k.charCodeAt(0);
	}
	return (Inputs.keyPress[k] == true);
}
Inputs.GetKeyRelease = function(k) {
	if(typeof(k) == "string") {
		k = k.charCodeAt(0);
	}
	return (Inputs.keyRel[k] == true);
}

Inputs.GetMouseDown = function(b) {
	if(b == 1) return Inputs.mouseLeft;
	if(b == 2) return Inputs.mouseMiddle;
	if(b == 3) return Inputs.mouseRight;
}
Inputs.GetMousePress = function(b) {
	if(b == 1) return Inputs.mouseLeftPress;
	if(b == 2) return Inputs.mouseMiddlePress;
	if(b == 3) return Inputs.mouseRightPress;
}
Inputs.GetMouseRelease = function(b) {
	if(b == 1) return Inputs.mouseLeftRel;
	if(b == 2) return Inputs.mouseMiddleRel;
	if(b == 3) return Inputs.mouseRightRel;
}

Inputs.MouseInsideRect = function(x,y,w,h) {
	return (Inputs.mouseX >= x && Inputs.mouseY &gt, y && Inputs.mouseX <= x+w && Inputs.mouseY <= y+h);
}
Inputs.MouseInsideCircle = function(x,y,r) {
	var dx = Inputs.mouseX - x;
	var dy = Inputs.mouseY - y;
	return dx*dx+dy*dy <= r*r;
}

Inputs.MouseInsideText = function(str, x, y, col1, col2) {
	var w = game.ctx.measureText(str).width;
	var h = 30;
	var inside = (Inputs.mouseX > x - w/2 && Inputs.mouseY > y - h && Inputs.mouseX < x + w/2 && Inputs.mouseY < y+4 );
	if(inside) game.ctx.fillStyle = col2;
	else game.ctx.fillStyle = col1;
	game.ctx.fillText(str, x, y);
	return inside;
};

window.addEventListener('load', function () {
    document.querySelector('.pre-loader').className += ' hidden';
});
document.addEventListener("DOMContentLoaded", function () {
	openFullscreen();
});
function toggleFullscreen() {
	if (!document.fullscreenElement) {
		openFullscreen();
	} else {
		closeFullscreen();
	}
}
function openFullscreen() {
	if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
	} else if (document.documentElement.mozRequestFullScreen) { // Firefox
		document.documentElement.mozRequestFullScreen();
	} else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari e Opera
		document.documentElement.webkitRequestFullscreen();
	} else if (document.documentElement.msRequestFullscreen) { // Edge
		document.documentElement.msRequestFullscreen();
	}
}

function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { // Firefox
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { // Chrome, Safari e Opera
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { // Edge
		document.msExitFullscreen();
	}
}

document.addEventListener("fullscreenchange", function () {
	let btn = document.getElementById("fullscreen-btn");
	if (document.fullscreenElement) {
		btn.innerText = "Esci da Schermo Intero";
	} else {
		btn.innerText = "Entra in Schermo Intero";
	}
});
function Game() { // www.html.it/pag/49672/gestione-e-caricamento-degli-asset-di-gioco/
    this.canvas = document.getElementById("GameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Funzione per adattare il canvas alla finestra
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

    // Nasconde il cursore
    this.canvas.style.cursor = "img/cursore.png";

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

    if (!this.ctx) {
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    }
	//aggiorna animazioni
	this.EndLoop = function(){
		if(this.level > 0){
			this.player.UpdateAnimation();
		}
	}
    this.GameLoop = function() {
        this.resizeCanvas(); // Assicura che il canvas si adatti a ogni frame
        this.Draw();
        window.requestAnimationFrame(() => this.GameLoop());
		Inputs.Clear();
		this.Draw();
		this.EndLoop();
    };

    // Aggiunge un listener per adattare il canvas quando la finestra cambia dimensione
    window.addEventListener("resize", this.resizeCanvas);

    // Avvia il loop di gioco
    this.GameLoop();
}
function StartGame(){
	//crea un istanza di Game
	game = new Game();
}
window.addEventListener('load', function() {
  StartGame();
}, true);
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function(callback) {
		      window.setTimeout(callback, 1000 / 60);
		   };
})();
window.addEventListener('load', function() {
  StartGame();
}, true);

function GameObject(x, y, speed) {
	this.x = x;
	this.y = y;
	this.showInfo = function() {
		alert(this.x + "," + this.y + "," + this.speed);
	}
}
function sparo(x, y, speed){
	GameObject.call(this, x, y);
	this.speed = speed;
}
//eredita da GameObject
sparo.prototype = Object.create(GameObject.prototype);
//reimposta il constructor
sparo.prototype.constructor = sparo;
s1 = new sparo(10, 150, 30);

rh = new ResourcesHandler( function() {
		game.LoadLevel(0);
		game.GameLoop();
	});

function ResourcesHandler(callback) {
	this.resNumber = 0;
	this.resLoaded = 0; 
	this.errors = [];
	this.status = 0;
	this.loading = false;
	
	/* caricamento sprite e immagini */
	this.LoadSprite = function(url, frames, funct) { //(immagine personaggio, frames, )
		this.loading = true;
		var img = new Image();
		img.src = url;
		img.rh = this.img;
		this.resNumber++;
		img.frames = frames;
		this.w = this.width/this.frames;
		img.onload = function() { 
			if(funct != undefined) {
				funct();
			}
			this.w = this.width/this.frames;
			this.rh.resLoaded++;
			this.rh.CheckLoaded();
		};
		img.addEventListener("error", function(e) {
			this.rh.resNumber--;
			this.rh.errors.push([url, e]);
			this.rh.CheckLoaded();
		});
		return img;
	}
	this.CheckLoaded = function() {
		if(!this.loading) return null;
		if(this.resLoaded + this.errors.length >= this.resNumber) {
			callback();
			this.resNumber = 0;
			this.resLoaded = 0;
			this.loading = false;
		}
	}
	this.LoadSound = function(url, formats) {
		this.loading = true;
		var sound = new Audio();
		sound.src = url+"."+formats[0];
		sound.formatIndex = 0;
		sound.volume = 0.05;
		this.resNumber++;
		sound.rh = this;
		sound.addEventListener("canplaythrough", function() {
			this.rh.resLoaded++;
			this.rh.CheckLoaded();
		}, false);
		sound.addEventListener("error", function(e) {
			if(++this.formatIndex >= formats.length) {
				this.rh.errors.push([url, e.currentTarget.error.code]);
				this.rh.CheckLoaded();
			} else {
				this.src = url+"."+formats[this.formatIndex];
			}
		});
		return sound;
	}
	LoadSound("sounds/jump", ["mp3", "ogg"]);//esempio
	
}
this.sprLogo        = rh.LoadSprite("img/logo.png",1);
this.sprSplashLogo  = rh.LoadSprite("img/splashLogo.png",1);
//cursore del mouse
this.sprCursor = rh.LoadSprite("img/cursor.png",1); 
this.backgroundMenu = rh.LoadSprite("img/backgroundmenu.png", 1, function() {
	game.patternMenu = game.ctx.createPattern(game.backgroundMenu,"repeat");
});
this.sndMusic = rh.LoadSound("audio/datagrove",["ogg", "mp3"]);
this.sprPlayerIdle     = rh.LoadSprite("img/playerIdle.png",2);
this.sprPlayerIdleShot = rh.LoadSprite("img/playerShot.png",1);
this.sprPlayerRun      = rh.LoadSprite("img/playerRun.png",6);
this.sprPlayerJump     = rh.LoadSprite("img/playerJump.png",1);
this.sprPlayerJumpShot = rh.LoadSprite("img/playerJumpShot.png",1);
this.sprPlayerFall     = rh.LoadSprite("img/playerFall.png",1);
this.sprPlayerFallShot = rh.LoadSprite("img/playerFallShot.png",1);
this.background1       = rh.LoadSprite("img/sky.png", 1);
function Player(){
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
}
this.viewX = 0;
this.viewY = 0;