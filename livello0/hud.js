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
	}
}