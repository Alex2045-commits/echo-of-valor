let Inputs = {
  keys: {},

  GetKeyDown: function (key) {
    return this.keys[key] === true;
  },

  GetKeyPress: function (key) {
    if (this.keys[key] === true) {
      this.keys[key] = false;
      return true;
    }
    return false;
  },

  Clear: function () {
    for (let key in this.keys) {
      this.keys[key] = false;
    }
  },

  Init: function () {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }
};

Inputs.Init();