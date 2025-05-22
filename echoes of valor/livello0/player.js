function Player(
  spriteIdle, spriteRun, spriteRunBack, spriteJump, spriteJumpBack,
  spriteAttack1, spriteAttack2, spriteAttack3,
  spriteAttackBack1, spriteAttackBack2, spriteAttackBack3
) {
  this.x = 100;
  this.y = window.innerHeight - 400;

  this.spriteIdle = spriteIdle;
  this.spriteRun = spriteRun;
  this.spriteRunBack = spriteRunBack;
  this.spriteJump = spriteJump;
  this.spriteJumpBack = spriteJumpBack;
  this.spriteAttack1 = spriteAttack1;
  this.spriteAttack2 = spriteAttack2;
  this.spriteAttack3 = spriteAttack3;
  this.spriteAttackBack1 = spriteAttackBack1;
  this.spriteAttackBack2 = spriteAttackBack2;
  this.spriteAttackBack3 = spriteAttackBack3;

  this.sprite = this.spriteIdle;

  this.velocityY = 0;
  this.isJumping = false;
  this.isInAir = false;
  this.isMovingRight = false;
  this.isMovingLeft = false;
  this.lastDirection = "right";
  this.speed = 5;

  this.jumpForce = -15;
  this.runFrames = 8;
  this.jumpFrames = 12;
  this.attackFrames = [6, 4, 3];

  this.frameX = 0;
  this.frameCount = 0;
  this.frameRate = 10;

  this.scaleFactor = 2;

  this.attackCounter = -1;
  this.isAttacking = false;
  this.attackReversed = false;

  this.handleMouseClick = (counter) => {
    if (this.isAttacking) return;

    this.attackCounter = counter;
    const facingLeft = this.lastDirection === "left";
    this.attackReversed = facingLeft;
    this.isAttacking = true;
    this.frameX = 0;

    if (this.attackCounter === 0)
      this.sprite = facingLeft ? this.spriteAttackBack1 : this.spriteAttack1;
    else if (this.attackCounter === 1)
      this.sprite = facingLeft ? this.spriteAttackBack2 : this.spriteAttack2;
    else if (this.attackCounter === 2)
      this.sprite = facingLeft ? this.spriteAttackBack3 : this.spriteAttack3;
  };

  this.Update = function () {
    const onGround = this.y >= window.innerHeight - 450;

    if ((game.keys[" "] || game.keys["ArrowUp"]) && !this.isJumping && onGround) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
      this.isInAir = true;

      if (this.isMovingLeft) {
        this.sprite = this.spriteJumpBack;
        this.lastDirection = "left";
      } else if (this.isMovingRight) {
        this.sprite = this.spriteJump;
        this.lastDirection = "right";
      } else {
        this.sprite = this.lastDirection === "left" ? this.spriteJumpBack : this.spriteJump;
      }

      this.frameX = 0;
    }

    if (!onGround || this.velocityY < 0) {
      this.velocityY += game.gravity;
    } else {
      this.velocityY = 0;
      this.y = window.innerHeight - 450;
      this.isJumping = false;
      this.isInAir = false;
    }

    this.y += this.velocityY;

    // Boundary check for y position (ensuring the player doesn't go off the screen vertically)
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }

    // Boundary check for x position (ensuring the player doesn't go off the screen horizontally)
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > window.innerWidth) {
      this.x = window.innerWidth - this.width;
    }

    if (this.isAttacking) {
      this.frameCount++;
      const frames = this.attackFrames[this.attackCounter];
      if (this.frameCount >= this.frameRate) {
        this.frameCount = 0;
        this.frameX++;
        if (this.frameX >= frames) {
          this.frameX = 0;
          this.isAttacking = false;
          this.attackReversed = false;
        }
      }
      return;
    }

    // Movement logic
    if (game.keys["d"] || game.keys["ArrowRight"]) {
      this.x += this.speed;
      this.isMovingRight = true;
      this.isMovingLeft = false;
      if (!this.isJumping) this.sprite = this.spriteRun;
      this.lastDirection = "right";
    } else if (game.keys["a"] || game.keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.isMovingLeft = true;
      this.isMovingRight = false;
      if (!this.isJumping) this.sprite = this.spriteRunBack;
      this.lastDirection = "left";
    } else {
      this.isMovingLeft = false;
      this.isMovingRight = false;
      if (!this.isJumping) {
        this.sprite = this.spriteIdle;
        this.frameX = 0;
      }
    }

    // Animation frame handling
    if (
      this.sprite === this.spriteRun || this.sprite === this.spriteRunBack ||
      this.sprite === this.spriteJump || this.sprite === this.spriteJumpBack
    ) {
      this.frameCount++;
      if (this.frameCount >= this.frameRate) {
        this.frameCount = 0;
        this.frameX++;
        const max = (this.sprite === this.spriteJump || this.sprite === this.spriteJumpBack)
          ? this.jumpFrames : this.runFrames;
        if (this.frameX >= max) this.frameX = 0;
      }
    }
  };

  this.Draw = function (ctx) {
    let totalFrames = 1;

    if (this.sprite === this.spriteRun || this.sprite === this.spriteRunBack) {
      totalFrames = this.runFrames;
    } else if (this.sprite === this.spriteJump || this.sprite === this.spriteJumpBack) {
      totalFrames = this.jumpFrames;
    } else if (
      this.sprite === this.spriteAttack1 || this.sprite === this.spriteAttackBack1
    ) {
      totalFrames = this.attackFrames[0];
    } else if (
      this.sprite === this.spriteAttack2 || this.sprite === this.spriteAttackBack2
    ) {
      totalFrames = this.attackFrames[1];
    } else if (
      this.sprite === this.spriteAttack3 || this.sprite === this.spriteAttackBack3
    ) {
      totalFrames = this.attackFrames[2];
    }

    const frameW = this.sprite.width / totalFrames;
    const frameH = this.sprite.height;
    const drawW = frameW * this.scaleFactor;
    const drawH = frameH * this.scaleFactor;

    this.width = drawW;
    this.height = drawH;

    const frameIndex = this.attackReversed ? totalFrames - 1 - this.frameX : this.frameX;

    ctx.drawImage(
      this.sprite,
      frameIndex * frameW,
      0,
      frameW,
      frameH,
      this.x,
      this.y,
      drawW,
      drawH
    );
  };
}
