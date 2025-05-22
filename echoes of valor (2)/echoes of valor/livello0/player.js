function Player(game) {
  this.game = game;
  this.x = game.canvas.width / 2;
  this.y = game.canvas.height / 2;
  this.width = 64;
  this.height = 64;
  this.hSpeed = 0;
  this.vSpeed = 0;
  this.maxSpeed = 5;
  this.sprite = game.sprPlayerRun;
  this.gravity = game.gravity;
  this.curFrame = 0;
  this.animSpeed = 0.2;

  this.Draw = function () {
    this.game.ctx.save();
    this.game.ctx.translate(this.x - this.game.viewX, this.y - this.game.viewY);
    var ox = Math.floor(this.curFrame) * this.width;
    this.game.ctx.drawImage(this.sprite, ox, 0, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
    this.game.ctx.restore();
  };

  this.Update = function () {
    if (Inputs.GetKeyDown("ArrowRight")) {
      if (this.hSpeed < 0) this.hSpeed = 0;
      if (this.hSpeed < this.maxSpeed) this.hSpeed += 0.4;
    } else if (Inputs.GetKeyDown("ArrowLeft")) {
      if (this.hSpeed > 0) this.hSpeed = 0;
      if (this.hSpeed > -this.maxSpeed) this.hSpeed -= 0.4;
    } else {
      this.hSpeed /= 1.1;
      if (Math.abs(this.hSpeed) < 1) this.hSpeed = 0;
    }

    this.vSpeed += this.gravity;

    if (!this.CheckCollision(0, this.vSpeed)) {
      this.y += this.vSpeed;
    } else {
      this.vSpeed = 0;
    }

    if (!this.CheckCollision(this.hSpeed, 0)) {
      this.x += this.hSpeed;
    } else {
      this.hSpeed = 0;
    }

    if (Inputs.GetKeyPress("z") && this.CheckCollision(0, 1)) {
      this.vSpeed = -9;
    }

    this.UpdateAnimation();

    this.game.viewX = Math.floor(Math.lerp(this.game.viewX, this.x - this.game.canvas.width / 2, 0.2));
    this.game.viewY = Math.floor(Math.lerp(this.game.viewY, this.y - this.game.canvas.height / 2, 0.2));
  };

  this.CheckCollision = function (dx, dy) {
    return false;
  };

  this.UpdateAnimation = function () {
    this.curFrame += this.animSpeed;
    if (this.curFrame >= 4) {
      this.curFrame = 0;
    }
  };
}