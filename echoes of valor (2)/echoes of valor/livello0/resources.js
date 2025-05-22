function ResourcesHandler(callback) {
  this.resNumber = 0;
  this.resLoaded = 0;
  this.errors = [];
  this.status = 0;
  this.loading = false;

  this.LoadSprite = function (url, frames, funct) {
    this.loading = true;
    var img = new Image();
    img.src = url;
    img.rh = this;
    this.resNumber++;
    img.frames = frames;
    img.onload = function () {
      if (funct !== undefined) {
        funct();
      }
      this.rh.resLoaded++;
      this.rh.CheckLoaded();
    };
    img.addEventListener("error", function (e) {
      this.rh.resNumber--;
      this.rh.errors.push([url, e]);
      this.rh.CheckLoaded();
    });
    return img;
  };

  this.CheckLoaded = function () {
    if (!this.loading) return null;
    this.DrawLoading();
    if (this.resLoaded + this.errors.length >= this.resNumber) {
      callback();
      this.resNumber = 0;
      this.resLoaded = 0;
      this.loading = false;
    }
  };

  this.DrawLoading = function () {
    this.status = this.resLoaded / (this.resNumber + this.errors.length);
    var cx = game.canvas.width / 2;
    var cy = game.canvas.height / 2;
    game.ctx.fillStyle = "#333";
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    game.ctx.beginPath();
    game.ctx.strokeStyle = "#222";
    game.ctx.lineWidth = 25;
    game.ctx.arc(cx, cy, 80, 0, Math.PI * 2, false);
    game.ctx.stroke();
    var radians = (360 * this.status) * Math.PI / 180;
    game.ctx.beginPath();
    game.ctx.strokeStyle = "#ddd";
    game.ctx.lineWidth = 25;
    game.ctx.arc(cx, cy, 80, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
    game.ctx.stroke();
    game.ctx.font = '22pt Segoe UI Light';
    game.ctx.fillStyle = '#ddd';
    game.ctx.fillText(Math.floor(this.status * 100) + "%", cx - 25, cy + 10);
  };
}