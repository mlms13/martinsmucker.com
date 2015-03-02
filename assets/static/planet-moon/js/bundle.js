(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./client/js/index.js":[function(require,module,exports){
var Phaser = window.Phaser;

var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Main Menu', require('./states/mainmenu'));
game.state.add('Game', require('./states/game'));
game.state.add('Game Over', require('./states/gameover'));
game.state.start('Boot');

},{"./states/boot":"/home/michael/Projects/Games/planet-battles/client/js/states/boot.js","./states/game":"/home/michael/Projects/Games/planet-battles/client/js/states/game.js","./states/gameover":"/home/michael/Projects/Games/planet-battles/client/js/states/gameover.js","./states/mainmenu":"/home/michael/Projects/Games/planet-battles/client/js/states/mainmenu.js","./states/preloader":"/home/michael/Projects/Games/planet-battles/client/js/states/preloader.js"}],"/home/michael/Projects/Games/planet-battles/client/js/entities/attacks.js":[function(require,module,exports){
var Phaser = window.Phaser;

var Attacks = function (game) {
  Phaser.Group.call(this, game);

  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.ARCADE;
};

Attacks.prototype = Object.create(Phaser.Group.prototype);
Attacks.prototype.constructor = Attacks;

Attacks.prototype.add = function (origin, target, speed, health, texture) {
  var missile = this.create(origin.x, origin.y, texture);
  missile.anchor.setTo(0.5);
  missile.health = health;
  missile.rotation = Phaser.Point.angle(target, origin);
  missile.body.velocity = this.game.physics.arcade.velocityFromRotation(missile.rotation, speed);

  // flip texture if missile is coming from the right
  if (origin.x > this.game.world.width / 2) {
    missile.scale.y = -1;
  }
};

Attacks.prototype.addRandom = function (target, speed, fast) {
  var x = Math.floor(Math.random() * this.game.world.width),
      y = Math.floor(Math.random() * this.game.world.height),
      texture = fast ? 'missile2' : 'missile',
      health = fast ? 5 : 10;

  speed = fast ? speed * 2.2 : speed;

  if (Math.random() > 0.5) {
    // keep x width and move y to perimeter
    y = (y / this.game.world.height > 0.5) ? this.game.world.height : 0;
  } else {
    x = (x / this.game.world.width > 0.5) ? this.game.world.width : 0;
  }
  this.add({ x: x, y: y }, target, speed, health, texture);
};

module.exports = Attacks;

},{}],"/home/michael/Projects/Games/planet-battles/client/js/entities/bullets.js":[function(require,module,exports){
var Phaser = window.Phaser;

var Bullets = function (game) {
  Phaser.Group.call(this, game);

  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.ARCADE;

  this._nextBulletsAt = 0;

  // TODO: remove?
  this.setAll('outOfBoundsKill', true);
  this.setAll('checkWorldBounds', true);
};

Bullets.prototype = Object.create(Phaser.Group.prototype);
Bullets.prototype.constructor = Bullets;

Bullets.prototype.fire = function (turrets, speed, lifespan, cooldown) {
  var bullet, turret, i;

  if (this._nextBulletsAt > this.game.time.now) {
    return;
  }

  cooldown = cooldown === undefined ? 100 : cooldown;

  for (i = 0; i < turrets.children.length; i++) {
    turret = turrets.children[i];
    bullet = this.create(turret.x, turret.y, 'bullet');
    bullet.lifespan = lifespan;
    this.game.physics.arcade.velocityFromRotation(turret.rotation, speed, bullet.body.velocity);
  }

  this._nextBulletsAt = this.game.time.now + cooldown;
};

module.exports = Bullets;

},{}],"/home/michael/Projects/Games/planet-battles/client/js/entities/planet.js":[function(require,module,exports){
var Phaser = window.Phaser;
var Bullets = require('./bullets');

var Planet = function (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'planet');

  this.radius = this.width / 2;
  this.buildings = {};

  this._addColony(this.radius, this.radius);
  this._addTurrets(3, this.radius - 30, this.radius);
  this.addBullets();
};

Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.fireBullets = function (speed, lifespan, cooldown) {
  this.bullets.fire(this.buildings.turrets, speed, lifespan, cooldown);
};

Planet.prototype._addColony = function (x, y) {
  this.buildings.colony = this.game.add.sprite(x, y, 'colony');
  this.game.physics.enable(this.buildings.colony, Phaser.Physics.ARCADE);
  this.buildings.colony.anchor.setTo(0.5);
  this.addChild(this.buildings.colony);
};

Planet.prototype._addTurrets = function (howMany, radius, offset) {
  var sprite, angle, turretX, turretY, i;

  this.buildings.turrets = this.game.add.group();
  this.addChild(this.buildings.turrets);

  for (i = 0; i < howMany; i++) {
    angle = 360 / howMany;
    turretX = Math.cos(i * angle * (Math.PI / 180)) * radius + offset;
    turretY = Math.sin(i * angle * (Math.PI / 180)) * radius + offset;
    sprite = this.buildings.turrets.create(turretX, turretY, 'turret');
    sprite.anchor.setTo(0.2, 0.5);
  }
};

Planet.prototype.addBullets = function () {
  this.bullets = new Bullets(this.game);
  this.addChild(this.bullets);
};

module.exports = Planet;

},{"./bullets":"/home/michael/Projects/Games/planet-battles/client/js/entities/bullets.js"}],"/home/michael/Projects/Games/planet-battles/client/js/states/boot.js":[function(require,module,exports){
function Boot() {}

Boot.prototype = {
  preload: function () {
    // start loading the rest of the assets
    this.load.image('preloader', 'assets/preloader.png');
  },
  create: function () {
    this.game.state.start('Preloader');
  }
};

module.exports = Boot;

},{}],"/home/michael/Projects/Games/planet-battles/client/js/states/game.js":[function(require,module,exports){
var Planet = require('../entities/planet');
var Attacks = require('../entities/attacks');

function Game() {}

var planet;
var attacks;
var explosions;
var fireButton;
var nextAttackAt;
var elapsed;
var timer;

Game.prototype = {
  _prepareExplosions: function () {
    explosions = this.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(50, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(function (explosion) {
      explosion.animations.add('explosion');
    });
  },

  _damageMissile: function (bullet, missile) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x, bullet.body.y);
    missile.damage(1);
    bullet.kill();

    if (missile.alive) {
      explosion.scale.x = explosion.scale.y = 0.3;
    } else {
      explosion.scale.x = explosion.scale.y = 1;
      explosion.body.velocity.x = missile.body.velocity.x;
      explosion.body.velocity.y = missile.body.velocity.y;
    }
    explosion.play('explosion', 24, false, true);
  },

  _damageColony: function (colony, missile) {
    var square, fadeOut, explosion;
    colony.damage(1);
    missile.kill();

    // if no more colony, switch show "game over" message
    if (!colony.alive) {
      explosion = explosions.getFirstExists(false);
      explosion.reset(colony.body.x + colony.width / 2, colony.body.y + colony.height / 2);
      explosion.scale.x = explosion.scale.y = 2.5;
      explosion.play('explosion', 24, false, true);

      // draw a mostly-opaque black box over the game
      square = this.add.graphics();
      square.beginFill(0x0, 1);
      square.alpha = 0;
      square.drawRect(0, 0, this.world.width, this.world.height);
      square.endFill();

      // tween it good
      fadeOut = this.add.tween(square).to({ alpha: 0.7 }, 500);

      fadeOut.onComplete.add(function () {
        this.state.start('Game Over', true, false, elapsed);
      }, this);

      explosion.animations.currentAnim.onComplete.add(function () {
        attacks.destroy();
        fadeOut.start();
      }, this);
    }
  },

  _updateTime: function () {
    var min = Math.floor(elapsed / 60),
        sec = elapsed - (min * 60),
        str = min + " min " + sec.toFixed(1) + " sec";

    timer.text = str;
  },

  create: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // (re)set timers
    nextAttackAt = 0;
    elapsed = 0;

    var space = this.add.sprite(0, 0, 'space');
    planet = new Planet(this.game, this.world.centerX - 85, this.world.centerY - 85);
    space.addChild(planet);

    this._prepareExplosions();

    nextAttackAt = this.time.now + 200;
    attacks = new Attacks(this.game);

    timer = this.add.bitmapText(32, 32, 'Audiowide', '', 20);
  },

  update: function () {
    var attackInterval;

    if (!planet.buildings.colony.alive) {
      return;
    }

    // never allow more than 250ms to be added per frame
    // which happens when you blur, then re-focus the tab
    elapsed += Math.min(this.time.elapsed / 1000, 0.25);
    this._updateTime();

    // handle collisions
    this.physics.arcade.overlap(planet.buildings.colony, attacks, this._damageColony, null, this);
    this.physics.arcade.overlap(planet.bullets, attacks, this._damageMissile, null, this);

    planet.buildings.turrets.children.forEach(function (turret) {
      turret.rotation = Phaser.Point.angle(this.input, turret.world);
    }, this);

    if (fireButton.isDown || this.input.activePointer.isDown) {
      planet.fireBullets(400, 1000);
    }

    if (nextAttackAt < this.time.now) {
      attacks.addRandom(planet.buildings.colony.world, 50 + elapsed / 10, Math.random() < elapsed / 600);

      // set the timer for the next attack so that attacks increase in frequency
      // over time, but have randomness within 1 second
      attackInterval = 40 / (elapsed + 8);
      nextAttackAt = this.time.now + 1000 * (attackInterval + Math.random());
    }
  }
};

module.exports = Game;

},{"../entities/attacks":"/home/michael/Projects/Games/planet-battles/client/js/entities/attacks.js","../entities/planet":"/home/michael/Projects/Games/planet-battles/client/js/entities/planet.js"}],"/home/michael/Projects/Games/planet-battles/client/js/states/gameover.js":[function(require,module,exports){
var Planet = require('../entities/planet');

function GameOver() {}

var clock;

GameOver.prototype = {
  init: function (elapsed) {
    var min = Math.floor(elapsed / 60),
        sec = elapsed - (min * 60),
        str = min + " min " + sec.toFixed(1) + " sec";
    clock = str;
  },
  create: function () {
    var space, planet, overlay, message, timer, button, buttonBg;

    // set up this scene to look like the previous one:
    space = this.add.sprite(0, 0, 'space');
    planet = new Planet(this.game, this.world.centerX - 85, this.world.centerY - 85);
    planet.buildings.colony.destroy();
    space.addChild(planet);

    // bring up the overlay
    square = this.add.graphics();
    square.beginFill(0x0, 0.7);
    square.drawRect(0, 0, this.world.width, this.world.height);
    square.endFill();

    // show the "game over" message
    message = this.add.bitmapText(0, 120, 'Audiowide Glow', 'Game Over!', 50);
    message.alpha = 0;
    message.updateText();
    message.x = this.world.centerX - (message.textWidth / 2);
    this.add.tween(message).to({ alpha: 1 }, 300).start();

    timer = this.add.bitmapText(0, 180, 'Audiowide', 'You Survived For ' + clock, 20);
    timer.alpha = 0;
    timer.updateText();
    timer.x = this.world.centerX - (timer.textWidth / 2);
    this.add.tween(timer).to({ alpha: 1 }, 300).start();

    // add a button to play again
    button = this.add.bitmapText(this.world.centerX, 400, 'Audiowide', 'Play Again', 20);
    button.alpha = 0;
    button.updateText();
    button.x = this.world.centerX - (button.textWidth / 2);
    button.hitArea = new Phaser.Rectangle(-20, -10, button.width + 40, button.height + 20);
    button.inputEnabled = true;
    button.buttonMode = true;

    // add a background for our play again button
    buttonBg = this.add.graphics();
    buttonBg.beginFill(0x999999, 0.1);
    buttonBg.alpha = 0;
    buttonBg.drawRect(button.x - 20, button.y - 10, button.width + 40, button.height + 20);
    buttonBg.endFill();

    button.events.onInputOver.add(function () {
      this.add.tween(buttonBg).to({ alpha: 1 }, 150).start();
    }, this);

    button.events.onInputOut.add(function () {
      this.add.tween(buttonBg).to({ alpha: 0 }, 150).start();
    }, this);

    button.events.onInputDown.add(function () {
      this.state.start('Game');
    }, this);

    this.add.tween(button).to({ alpha: 1 }, 300).start();
  },

  update: function () {
    if (this.input.keyboard.isDown(32) || this.input.keyboard.isDown(13)) {
      this.state.start('Game');
    }
  }
};

module.exports = GameOver;

},{"../entities/planet":"/home/michael/Projects/Games/planet-battles/client/js/entities/planet.js"}],"/home/michael/Projects/Games/planet-battles/client/js/states/mainmenu.js":[function(require,module,exports){
function MainMenu() {}

MainMenu.prototype = {
  create: function () {
    var space, fadeIn, title, button, buttonBg;
    space = this.add.sprite(0, 0, 'space');
    space.alpha = 0;

    // create the big title
    title = this.add.bitmapText(this.world.centerX, 100, 'Audiowide Glow', 'Defend The\nPlanet Moon', 64);
    title.alpha = 0;
    title.align = 'center';
    title.updateText();
    title.x = this.world.centerX - (title.textWidth / 2);

    // create the "start game" button
    button = this.add.bitmapText(this.world.centerX, 400, 'Audiowide', 'Start Game', 20);
    button.alpha = 0;
    button.updateText();
    button.x = this.world.centerX - (button.textWidth / 2);
    button.hitArea = new Phaser.Rectangle(-20, -10, button.width + 40, button.height + 20);
    button.inputEnabled = true;
    button.buttonMode = true;

    // add a background for our play again button
    buttonBg = this.add.graphics();
    buttonBg.beginFill(0x999999, 0.1);
    buttonBg.alpha = 0;
    buttonBg.drawRect(button.x - 20, button.y - 10, button.width + 40, button.height + 20);
    buttonBg.endFill();

    button.events.onInputOver.add(function () {
      this.add.tween(buttonBg).to({ alpha: 1 }, 150).start();
    }, this);

    button.events.onInputOut.add(function () {
      this.add.tween(buttonBg).to({ alpha: 0 }, 150).start();
    }, this);

    button.events.onInputDown.add(function () {
      this.state.start('Game');
    }, this);

    // fade everything in, in order
    fadeIn = this.add.tween(space).to({ alpha: 1 }, 500);
    fadeIn.onComplete.add(function () {
      this.add.tween(title).to({ alpha: 1 }, 500).start();
      this.add.tween(button).to({ alpha: 1 }, 500).start();
    }, this);
    fadeIn.start();
  },

  update: function () {
    if (this.input.keyboard.isDown(32) || this.input.keyboard.isDown(13)) {
      this.state.start('Game');
    }
  }
};

module.exports = MainMenu;

},{}],"/home/michael/Projects/Games/planet-battles/client/js/states/preloader.js":[function(require,module,exports){
function Preloader() {}

Preloader.prototype = {
  preload: function () {
    // set up the preload bar
    this.preloadBar = this.add.sprite(this.world.centerX - 150, this.world.centerY - 4, 'preloader');
    this.load.setPreloadSprite(this.preloadBar);

    // start loading the rest of the assets
    this.load.image('space', 'assets/space.png');
    this.load.image('planet', 'assets/planet.png');
    this.load.image('colony', 'assets/colony.png');
    this.load.image('turret', 'assets/turret.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('missile', 'assets/missile.png');
    this.load.image('missile2', 'assets/missile_green.png');
    this.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
    this.load.bitmapFont('Audiowide Glow', 'assets/audiowide/glow.png', 'assets/audiowide/glow.fnt');
    this.load.bitmapFont('Audiowide', 'assets/audiowide/small.png', 'assets/audiowide/small.fnt');
  },
  create: function () {
    this.game.state.start('Main Menu');
  }
};

module.exports = Preloader;

},{}]},{},["./client/js/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvaW5kZXguanMiLCJjbGllbnQvanMvZW50aXRpZXMvYXR0YWNrcy5qcyIsImNsaWVudC9qcy9lbnRpdGllcy9idWxsZXRzLmpzIiwiY2xpZW50L2pzL2VudGl0aWVzL3BsYW5ldC5qcyIsImNsaWVudC9qcy9zdGF0ZXMvYm9vdC5qcyIsImNsaWVudC9qcy9zdGF0ZXMvZ2FtZS5qcyIsImNsaWVudC9qcy9zdGF0ZXMvZ2FtZW92ZXIuanMiLCJjbGllbnQvanMvc3RhdGVzL21haW5tZW51LmpzIiwiY2xpZW50L2pzL3N0YXRlcy9wcmVsb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBoYXNlciA9IHdpbmRvdy5QaGFzZXI7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDgwMCwgNjAwLCBQaGFzZXIuQVVUTyk7XG5cbmdhbWUuc3RhdGUuYWRkKCdCb290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdQcmVsb2FkZXInLCByZXF1aXJlKCcuL3N0YXRlcy9wcmVsb2FkZXInKSk7XG5nYW1lLnN0YXRlLmFkZCgnTWFpbiBNZW51JywgcmVxdWlyZSgnLi9zdGF0ZXMvbWFpbm1lbnUnKSk7XG5nYW1lLnN0YXRlLmFkZCgnR2FtZScsIHJlcXVpcmUoJy4vc3RhdGVzL2dhbWUnKSk7XG5nYW1lLnN0YXRlLmFkZCgnR2FtZSBPdmVyJywgcmVxdWlyZSgnLi9zdGF0ZXMvZ2FtZW92ZXInKSk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdCb290Jyk7XG4iLCJ2YXIgUGhhc2VyID0gd2luZG93LlBoYXNlcjtcblxudmFyIEF0dGFja3MgPSBmdW5jdGlvbiAoZ2FtZSkge1xuICBQaGFzZXIuR3JvdXAuY2FsbCh0aGlzLCBnYW1lKTtcblxuICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlO1xuICB0aGlzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcbn07XG5cbkF0dGFja3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuR3JvdXAucHJvdG90eXBlKTtcbkF0dGFja3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQXR0YWNrcztcblxuQXR0YWNrcy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG9yaWdpbiwgdGFyZ2V0LCBzcGVlZCwgaGVhbHRoLCB0ZXh0dXJlKSB7XG4gIHZhciBtaXNzaWxlID0gdGhpcy5jcmVhdGUob3JpZ2luLngsIG9yaWdpbi55LCB0ZXh0dXJlKTtcbiAgbWlzc2lsZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgbWlzc2lsZS5oZWFsdGggPSBoZWFsdGg7XG4gIG1pc3NpbGUucm90YXRpb24gPSBQaGFzZXIuUG9pbnQuYW5nbGUodGFyZ2V0LCBvcmlnaW4pO1xuICBtaXNzaWxlLmJvZHkudmVsb2NpdHkgPSB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUudmVsb2NpdHlGcm9tUm90YXRpb24obWlzc2lsZS5yb3RhdGlvbiwgc3BlZWQpO1xuXG4gIC8vIGZsaXAgdGV4dHVyZSBpZiBtaXNzaWxlIGlzIGNvbWluZyBmcm9tIHRoZSByaWdodFxuICBpZiAob3JpZ2luLnggPiB0aGlzLmdhbWUud29ybGQud2lkdGggLyAyKSB7XG4gICAgbWlzc2lsZS5zY2FsZS55ID0gLTE7XG4gIH1cbn07XG5cbkF0dGFja3MucHJvdG90eXBlLmFkZFJhbmRvbSA9IGZ1bmN0aW9uICh0YXJnZXQsIHNwZWVkLCBmYXN0KSB7XG4gIHZhciB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5nYW1lLndvcmxkLndpZHRoKSxcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmdhbWUud29ybGQuaGVpZ2h0KSxcbiAgICAgIHRleHR1cmUgPSBmYXN0ID8gJ21pc3NpbGUyJyA6ICdtaXNzaWxlJyxcbiAgICAgIGhlYWx0aCA9IGZhc3QgPyA1IDogMTA7XG5cbiAgc3BlZWQgPSBmYXN0ID8gc3BlZWQgKiAyLjIgOiBzcGVlZDtcblxuICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgIC8vIGtlZXAgeCB3aWR0aCBhbmQgbW92ZSB5IHRvIHBlcmltZXRlclxuICAgIHkgPSAoeSAvIHRoaXMuZ2FtZS53b3JsZC5oZWlnaHQgPiAwLjUpID8gdGhpcy5nYW1lLndvcmxkLmhlaWdodCA6IDA7XG4gIH0gZWxzZSB7XG4gICAgeCA9ICh4IC8gdGhpcy5nYW1lLndvcmxkLndpZHRoID4gMC41KSA/IHRoaXMuZ2FtZS53b3JsZC53aWR0aCA6IDA7XG4gIH1cbiAgdGhpcy5hZGQoeyB4OiB4LCB5OiB5IH0sIHRhcmdldCwgc3BlZWQsIGhlYWx0aCwgdGV4dHVyZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF0dGFja3M7XG4iLCJ2YXIgUGhhc2VyID0gd2luZG93LlBoYXNlcjtcblxudmFyIEJ1bGxldHMgPSBmdW5jdGlvbiAoZ2FtZSkge1xuICBQaGFzZXIuR3JvdXAuY2FsbCh0aGlzLCBnYW1lKTtcblxuICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlO1xuICB0aGlzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcblxuICB0aGlzLl9uZXh0QnVsbGV0c0F0ID0gMDtcblxuICAvLyBUT0RPOiByZW1vdmU/XG4gIHRoaXMuc2V0QWxsKCdvdXRPZkJvdW5kc0tpbGwnLCB0cnVlKTtcbiAgdGhpcy5zZXRBbGwoJ2NoZWNrV29ybGRCb3VuZHMnLCB0cnVlKTtcbn07XG5cbkJ1bGxldHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuR3JvdXAucHJvdG90eXBlKTtcbkJ1bGxldHMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQnVsbGV0cztcblxuQnVsbGV0cy5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uICh0dXJyZXRzLCBzcGVlZCwgbGlmZXNwYW4sIGNvb2xkb3duKSB7XG4gIHZhciBidWxsZXQsIHR1cnJldCwgaTtcblxuICBpZiAodGhpcy5fbmV4dEJ1bGxldHNBdCA+IHRoaXMuZ2FtZS50aW1lLm5vdykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvb2xkb3duID0gY29vbGRvd24gPT09IHVuZGVmaW5lZCA/IDEwMCA6IGNvb2xkb3duO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB0dXJyZXRzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgdHVycmV0ID0gdHVycmV0cy5jaGlsZHJlbltpXTtcbiAgICBidWxsZXQgPSB0aGlzLmNyZWF0ZSh0dXJyZXQueCwgdHVycmV0LnksICdidWxsZXQnKTtcbiAgICBidWxsZXQubGlmZXNwYW4gPSBsaWZlc3BhbjtcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUudmVsb2NpdHlGcm9tUm90YXRpb24odHVycmV0LnJvdGF0aW9uLCBzcGVlZCwgYnVsbGV0LmJvZHkudmVsb2NpdHkpO1xuICB9XG5cbiAgdGhpcy5fbmV4dEJ1bGxldHNBdCA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIGNvb2xkb3duO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXRzO1xuIiwidmFyIFBoYXNlciA9IHdpbmRvdy5QaGFzZXI7XG52YXIgQnVsbGV0cyA9IHJlcXVpcmUoJy4vYnVsbGV0cycpO1xuXG52YXIgUGxhbmV0ID0gZnVuY3Rpb24gKGdhbWUsIHgsIHkpIHtcbiAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIHgsIHksICdwbGFuZXQnKTtcblxuICB0aGlzLnJhZGl1cyA9IHRoaXMud2lkdGggLyAyO1xuICB0aGlzLmJ1aWxkaW5ncyA9IHt9O1xuXG4gIHRoaXMuX2FkZENvbG9ueSh0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMpO1xuICB0aGlzLl9hZGRUdXJyZXRzKDMsIHRoaXMucmFkaXVzIC0gMzAsIHRoaXMucmFkaXVzKTtcbiAgdGhpcy5hZGRCdWxsZXRzKCk7XG59O1xuXG5QbGFuZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5QbGFuZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUGxhbmV0O1xuXG5QbGFuZXQucHJvdG90eXBlLmZpcmVCdWxsZXRzID0gZnVuY3Rpb24gKHNwZWVkLCBsaWZlc3BhbiwgY29vbGRvd24pIHtcbiAgdGhpcy5idWxsZXRzLmZpcmUodGhpcy5idWlsZGluZ3MudHVycmV0cywgc3BlZWQsIGxpZmVzcGFuLCBjb29sZG93bik7XG59O1xuXG5QbGFuZXQucHJvdG90eXBlLl9hZGRDb2xvbnkgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLmJ1aWxkaW5ncy5jb2xvbnkgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4LCB5LCAnY29sb255Jyk7XG4gIHRoaXMuZ2FtZS5waHlzaWNzLmVuYWJsZSh0aGlzLmJ1aWxkaW5ncy5jb2xvbnksIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG4gIHRoaXMuYnVpbGRpbmdzLmNvbG9ueS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgdGhpcy5hZGRDaGlsZCh0aGlzLmJ1aWxkaW5ncy5jb2xvbnkpO1xufTtcblxuUGxhbmV0LnByb3RvdHlwZS5fYWRkVHVycmV0cyA9IGZ1bmN0aW9uIChob3dNYW55LCByYWRpdXMsIG9mZnNldCkge1xuICB2YXIgc3ByaXRlLCBhbmdsZSwgdHVycmV0WCwgdHVycmV0WSwgaTtcblxuICB0aGlzLmJ1aWxkaW5ncy50dXJyZXRzID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICB0aGlzLmFkZENoaWxkKHRoaXMuYnVpbGRpbmdzLnR1cnJldHMpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBob3dNYW55OyBpKyspIHtcbiAgICBhbmdsZSA9IDM2MCAvIGhvd01hbnk7XG4gICAgdHVycmV0WCA9IE1hdGguY29zKGkgKiBhbmdsZSAqIChNYXRoLlBJIC8gMTgwKSkgKiByYWRpdXMgKyBvZmZzZXQ7XG4gICAgdHVycmV0WSA9IE1hdGguc2luKGkgKiBhbmdsZSAqIChNYXRoLlBJIC8gMTgwKSkgKiByYWRpdXMgKyBvZmZzZXQ7XG4gICAgc3ByaXRlID0gdGhpcy5idWlsZGluZ3MudHVycmV0cy5jcmVhdGUodHVycmV0WCwgdHVycmV0WSwgJ3R1cnJldCcpO1xuICAgIHNwcml0ZS5hbmNob3Iuc2V0VG8oMC4yLCAwLjUpO1xuICB9XG59O1xuXG5QbGFuZXQucHJvdG90eXBlLmFkZEJ1bGxldHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYnVsbGV0cyA9IG5ldyBCdWxsZXRzKHRoaXMuZ2FtZSk7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5idWxsZXRzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhbmV0O1xuIiwiZnVuY3Rpb24gQm9vdCgpIHt9XG5cbkJvb3QucHJvdG90eXBlID0ge1xuICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gc3RhcnQgbG9hZGluZyB0aGUgcmVzdCBvZiB0aGUgYXNzZXRzXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkZXInLCAnYXNzZXRzL3ByZWxvYWRlci5wbmcnKTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdQcmVsb2FkZXInKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xuIiwidmFyIFBsYW5ldCA9IHJlcXVpcmUoJy4uL2VudGl0aWVzL3BsYW5ldCcpO1xudmFyIEF0dGFja3MgPSByZXF1aXJlKCcuLi9lbnRpdGllcy9hdHRhY2tzJyk7XG5cbmZ1bmN0aW9uIEdhbWUoKSB7fVxuXG52YXIgcGxhbmV0O1xudmFyIGF0dGFja3M7XG52YXIgZXhwbG9zaW9ucztcbnZhciBmaXJlQnV0dG9uO1xudmFyIG5leHRBdHRhY2tBdDtcbnZhciBlbGFwc2VkO1xudmFyIHRpbWVyO1xuXG5HYW1lLnByb3RvdHlwZSA9IHtcbiAgX3ByZXBhcmVFeHBsb3Npb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgZXhwbG9zaW9ucyA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgZXhwbG9zaW9ucy5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICBleHBsb3Npb25zLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcbiAgICBleHBsb3Npb25zLmNyZWF0ZU11bHRpcGxlKDUwLCAnZXhwbG9zaW9uJyk7XG4gICAgZXhwbG9zaW9ucy5zZXRBbGwoJ2FuY2hvci54JywgMC41KTtcbiAgICBleHBsb3Npb25zLnNldEFsbCgnYW5jaG9yLnknLCAwLjUpO1xuICAgIGV4cGxvc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAoZXhwbG9zaW9uKSB7XG4gICAgICBleHBsb3Npb24uYW5pbWF0aW9ucy5hZGQoJ2V4cGxvc2lvbicpO1xuICAgIH0pO1xuICB9LFxuXG4gIF9kYW1hZ2VNaXNzaWxlOiBmdW5jdGlvbiAoYnVsbGV0LCBtaXNzaWxlKSB7XG4gICAgdmFyIGV4cGxvc2lvbiA9IGV4cGxvc2lvbnMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpO1xuICAgIGV4cGxvc2lvbi5yZXNldChidWxsZXQuYm9keS54LCBidWxsZXQuYm9keS55KTtcbiAgICBtaXNzaWxlLmRhbWFnZSgxKTtcbiAgICBidWxsZXQua2lsbCgpO1xuXG4gICAgaWYgKG1pc3NpbGUuYWxpdmUpIHtcbiAgICAgIGV4cGxvc2lvbi5zY2FsZS54ID0gZXhwbG9zaW9uLnNjYWxlLnkgPSAwLjM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cGxvc2lvbi5zY2FsZS54ID0gZXhwbG9zaW9uLnNjYWxlLnkgPSAxO1xuICAgICAgZXhwbG9zaW9uLmJvZHkudmVsb2NpdHkueCA9IG1pc3NpbGUuYm9keS52ZWxvY2l0eS54O1xuICAgICAgZXhwbG9zaW9uLmJvZHkudmVsb2NpdHkueSA9IG1pc3NpbGUuYm9keS52ZWxvY2l0eS55O1xuICAgIH1cbiAgICBleHBsb3Npb24ucGxheSgnZXhwbG9zaW9uJywgMjQsIGZhbHNlLCB0cnVlKTtcbiAgfSxcblxuICBfZGFtYWdlQ29sb255OiBmdW5jdGlvbiAoY29sb255LCBtaXNzaWxlKSB7XG4gICAgdmFyIHNxdWFyZSwgZmFkZU91dCwgZXhwbG9zaW9uO1xuICAgIGNvbG9ueS5kYW1hZ2UoMSk7XG4gICAgbWlzc2lsZS5raWxsKCk7XG5cbiAgICAvLyBpZiBubyBtb3JlIGNvbG9ueSwgc3dpdGNoIHNob3cgXCJnYW1lIG92ZXJcIiBtZXNzYWdlXG4gICAgaWYgKCFjb2xvbnkuYWxpdmUpIHtcbiAgICAgIGV4cGxvc2lvbiA9IGV4cGxvc2lvbnMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpO1xuICAgICAgZXhwbG9zaW9uLnJlc2V0KGNvbG9ueS5ib2R5LnggKyBjb2xvbnkud2lkdGggLyAyLCBjb2xvbnkuYm9keS55ICsgY29sb255LmhlaWdodCAvIDIpO1xuICAgICAgZXhwbG9zaW9uLnNjYWxlLnggPSBleHBsb3Npb24uc2NhbGUueSA9IDIuNTtcbiAgICAgIGV4cGxvc2lvbi5wbGF5KCdleHBsb3Npb24nLCAyNCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAvLyBkcmF3IGEgbW9zdGx5LW9wYXF1ZSBibGFjayBib3ggb3ZlciB0aGUgZ2FtZVxuICAgICAgc3F1YXJlID0gdGhpcy5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgIHNxdWFyZS5iZWdpbkZpbGwoMHgwLCAxKTtcbiAgICAgIHNxdWFyZS5hbHBoYSA9IDA7XG4gICAgICBzcXVhcmUuZHJhd1JlY3QoMCwgMCwgdGhpcy53b3JsZC53aWR0aCwgdGhpcy53b3JsZC5oZWlnaHQpO1xuICAgICAgc3F1YXJlLmVuZEZpbGwoKTtcblxuICAgICAgLy8gdHdlZW4gaXQgZ29vZFxuICAgICAgZmFkZU91dCA9IHRoaXMuYWRkLnR3ZWVuKHNxdWFyZSkudG8oeyBhbHBoYTogMC43IH0sIDUwMCk7XG5cbiAgICAgIGZhZGVPdXQub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdHYW1lIE92ZXInLCB0cnVlLCBmYWxzZSwgZWxhcHNlZCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgICAgZXhwbG9zaW9uLmFuaW1hdGlvbnMuY3VycmVudEFuaW0ub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICBhdHRhY2tzLmRlc3Ryb3koKTtcbiAgICAgICAgZmFkZU91dC5zdGFydCgpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIF91cGRhdGVUaW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1pbiA9IE1hdGguZmxvb3IoZWxhcHNlZCAvIDYwKSxcbiAgICAgICAgc2VjID0gZWxhcHNlZCAtIChtaW4gKiA2MCksXG4gICAgICAgIHN0ciA9IG1pbiArIFwiIG1pbiBcIiArIHNlYy50b0ZpeGVkKDEpICsgXCIgc2VjXCI7XG5cbiAgICB0aW1lci50ZXh0ID0gc3RyO1xuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuICAgIGZpcmVCdXR0b24gPSB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuXG4gICAgLy8gKHJlKXNldCB0aW1lcnNcbiAgICBuZXh0QXR0YWNrQXQgPSAwO1xuICAgIGVsYXBzZWQgPSAwO1xuXG4gICAgdmFyIHNwYWNlID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdzcGFjZScpO1xuICAgIHBsYW5ldCA9IG5ldyBQbGFuZXQodGhpcy5nYW1lLCB0aGlzLndvcmxkLmNlbnRlclggLSA4NSwgdGhpcy53b3JsZC5jZW50ZXJZIC0gODUpO1xuICAgIHNwYWNlLmFkZENoaWxkKHBsYW5ldCk7XG5cbiAgICB0aGlzLl9wcmVwYXJlRXhwbG9zaW9ucygpO1xuXG4gICAgbmV4dEF0dGFja0F0ID0gdGhpcy50aW1lLm5vdyArIDIwMDtcbiAgICBhdHRhY2tzID0gbmV3IEF0dGFja3ModGhpcy5nYW1lKTtcblxuICAgIHRpbWVyID0gdGhpcy5hZGQuYml0bWFwVGV4dCgzMiwgMzIsICdBdWRpb3dpZGUnLCAnJywgMjApO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhdHRhY2tJbnRlcnZhbDtcblxuICAgIGlmICghcGxhbmV0LmJ1aWxkaW5ncy5jb2xvbnkuYWxpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBuZXZlciBhbGxvdyBtb3JlIHRoYW4gMjUwbXMgdG8gYmUgYWRkZWQgcGVyIGZyYW1lXG4gICAgLy8gd2hpY2ggaGFwcGVucyB3aGVuIHlvdSBibHVyLCB0aGVuIHJlLWZvY3VzIHRoZSB0YWJcbiAgICBlbGFwc2VkICs9IE1hdGgubWluKHRoaXMudGltZS5lbGFwc2VkIC8gMTAwMCwgMC4yNSk7XG4gICAgdGhpcy5fdXBkYXRlVGltZSgpO1xuXG4gICAgLy8gaGFuZGxlIGNvbGxpc2lvbnNcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxhbmV0LmJ1aWxkaW5ncy5jb2xvbnksIGF0dGFja3MsIHRoaXMuX2RhbWFnZUNvbG9ueSwgbnVsbCwgdGhpcyk7XG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHBsYW5ldC5idWxsZXRzLCBhdHRhY2tzLCB0aGlzLl9kYW1hZ2VNaXNzaWxlLCBudWxsLCB0aGlzKTtcblxuICAgIHBsYW5ldC5idWlsZGluZ3MudHVycmV0cy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uICh0dXJyZXQpIHtcbiAgICAgIHR1cnJldC5yb3RhdGlvbiA9IFBoYXNlci5Qb2ludC5hbmdsZSh0aGlzLmlucHV0LCB0dXJyZXQud29ybGQpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKGZpcmVCdXR0b24uaXNEb3duIHx8IHRoaXMuaW5wdXQuYWN0aXZlUG9pbnRlci5pc0Rvd24pIHtcbiAgICAgIHBsYW5ldC5maXJlQnVsbGV0cyg0MDAsIDEwMDApO1xuICAgIH1cblxuICAgIGlmIChuZXh0QXR0YWNrQXQgPCB0aGlzLnRpbWUubm93KSB7XG4gICAgICBhdHRhY2tzLmFkZFJhbmRvbShwbGFuZXQuYnVpbGRpbmdzLmNvbG9ueS53b3JsZCwgNTAgKyBlbGFwc2VkIC8gMTAsIE1hdGgucmFuZG9tKCkgPCBlbGFwc2VkIC8gNjAwKTtcblxuICAgICAgLy8gc2V0IHRoZSB0aW1lciBmb3IgdGhlIG5leHQgYXR0YWNrIHNvIHRoYXQgYXR0YWNrcyBpbmNyZWFzZSBpbiBmcmVxdWVuY3lcbiAgICAgIC8vIG92ZXIgdGltZSwgYnV0IGhhdmUgcmFuZG9tbmVzcyB3aXRoaW4gMSBzZWNvbmRcbiAgICAgIGF0dGFja0ludGVydmFsID0gNDAgLyAoZWxhcHNlZCArIDgpO1xuICAgICAgbmV4dEF0dGFja0F0ID0gdGhpcy50aW1lLm5vdyArIDEwMDAgKiAoYXR0YWNrSW50ZXJ2YWwgKyBNYXRoLnJhbmRvbSgpKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsInZhciBQbGFuZXQgPSByZXF1aXJlKCcuLi9lbnRpdGllcy9wbGFuZXQnKTtcblxuZnVuY3Rpb24gR2FtZU92ZXIoKSB7fVxuXG52YXIgY2xvY2s7XG5cbkdhbWVPdmVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsYXBzZWQpIHtcbiAgICB2YXIgbWluID0gTWF0aC5mbG9vcihlbGFwc2VkIC8gNjApLFxuICAgICAgICBzZWMgPSBlbGFwc2VkIC0gKG1pbiAqIDYwKSxcbiAgICAgICAgc3RyID0gbWluICsgXCIgbWluIFwiICsgc2VjLnRvRml4ZWQoMSkgKyBcIiBzZWNcIjtcbiAgICBjbG9jayA9IHN0cjtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwYWNlLCBwbGFuZXQsIG92ZXJsYXksIG1lc3NhZ2UsIHRpbWVyLCBidXR0b24sIGJ1dHRvbkJnO1xuXG4gICAgLy8gc2V0IHVwIHRoaXMgc2NlbmUgdG8gbG9vayBsaWtlIHRoZSBwcmV2aW91cyBvbmU6XG4gICAgc3BhY2UgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ3NwYWNlJyk7XG4gICAgcGxhbmV0ID0gbmV3IFBsYW5ldCh0aGlzLmdhbWUsIHRoaXMud29ybGQuY2VudGVyWCAtIDg1LCB0aGlzLndvcmxkLmNlbnRlclkgLSA4NSk7XG4gICAgcGxhbmV0LmJ1aWxkaW5ncy5jb2xvbnkuZGVzdHJveSgpO1xuICAgIHNwYWNlLmFkZENoaWxkKHBsYW5ldCk7XG5cbiAgICAvLyBicmluZyB1cCB0aGUgb3ZlcmxheVxuICAgIHNxdWFyZSA9IHRoaXMuYWRkLmdyYXBoaWNzKCk7XG4gICAgc3F1YXJlLmJlZ2luRmlsbCgweDAsIDAuNyk7XG4gICAgc3F1YXJlLmRyYXdSZWN0KDAsIDAsIHRoaXMud29ybGQud2lkdGgsIHRoaXMud29ybGQuaGVpZ2h0KTtcbiAgICBzcXVhcmUuZW5kRmlsbCgpO1xuXG4gICAgLy8gc2hvdyB0aGUgXCJnYW1lIG92ZXJcIiBtZXNzYWdlXG4gICAgbWVzc2FnZSA9IHRoaXMuYWRkLmJpdG1hcFRleHQoMCwgMTIwLCAnQXVkaW93aWRlIEdsb3cnLCAnR2FtZSBPdmVyIScsIDUwKTtcbiAgICBtZXNzYWdlLmFscGhhID0gMDtcbiAgICBtZXNzYWdlLnVwZGF0ZVRleHQoKTtcbiAgICBtZXNzYWdlLnggPSB0aGlzLndvcmxkLmNlbnRlclggLSAobWVzc2FnZS50ZXh0V2lkdGggLyAyKTtcbiAgICB0aGlzLmFkZC50d2VlbihtZXNzYWdlKS50byh7IGFscGhhOiAxIH0sIDMwMCkuc3RhcnQoKTtcblxuICAgIHRpbWVyID0gdGhpcy5hZGQuYml0bWFwVGV4dCgwLCAxODAsICdBdWRpb3dpZGUnLCAnWW91IFN1cnZpdmVkIEZvciAnICsgY2xvY2ssIDIwKTtcbiAgICB0aW1lci5hbHBoYSA9IDA7XG4gICAgdGltZXIudXBkYXRlVGV4dCgpO1xuICAgIHRpbWVyLnggPSB0aGlzLndvcmxkLmNlbnRlclggLSAodGltZXIudGV4dFdpZHRoIC8gMik7XG4gICAgdGhpcy5hZGQudHdlZW4odGltZXIpLnRvKHsgYWxwaGE6IDEgfSwgMzAwKS5zdGFydCgpO1xuXG4gICAgLy8gYWRkIGEgYnV0dG9uIHRvIHBsYXkgYWdhaW5cbiAgICBidXR0b24gPSB0aGlzLmFkZC5iaXRtYXBUZXh0KHRoaXMud29ybGQuY2VudGVyWCwgNDAwLCAnQXVkaW93aWRlJywgJ1BsYXkgQWdhaW4nLCAyMCk7XG4gICAgYnV0dG9uLmFscGhhID0gMDtcbiAgICBidXR0b24udXBkYXRlVGV4dCgpO1xuICAgIGJ1dHRvbi54ID0gdGhpcy53b3JsZC5jZW50ZXJYIC0gKGJ1dHRvbi50ZXh0V2lkdGggLyAyKTtcbiAgICBidXR0b24uaGl0QXJlYSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKC0yMCwgLTEwLCBidXR0b24ud2lkdGggKyA0MCwgYnV0dG9uLmhlaWdodCArIDIwKTtcbiAgICBidXR0b24uaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICBidXR0b24uYnV0dG9uTW9kZSA9IHRydWU7XG5cbiAgICAvLyBhZGQgYSBiYWNrZ3JvdW5kIGZvciBvdXIgcGxheSBhZ2FpbiBidXR0b25cbiAgICBidXR0b25CZyA9IHRoaXMuYWRkLmdyYXBoaWNzKCk7XG4gICAgYnV0dG9uQmcuYmVnaW5GaWxsKDB4OTk5OTk5LCAwLjEpO1xuICAgIGJ1dHRvbkJnLmFscGhhID0gMDtcbiAgICBidXR0b25CZy5kcmF3UmVjdChidXR0b24ueCAtIDIwLCBidXR0b24ueSAtIDEwLCBidXR0b24ud2lkdGggKyA0MCwgYnV0dG9uLmhlaWdodCArIDIwKTtcbiAgICBidXR0b25CZy5lbmRGaWxsKCk7XG5cbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXRPdmVyLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmFkZC50d2VlbihidXR0b25CZykudG8oeyBhbHBoYTogMSB9LCAxNTApLnN0YXJ0KCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXRPdXQuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuYWRkLnR3ZWVuKGJ1dHRvbkJnKS50byh7IGFscGhhOiAwIH0sIDE1MCkuc3RhcnQoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGJ1dHRvbi5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuYWRkLnR3ZWVuKGJ1dHRvbikudG8oeyBhbHBoYTogMSB9LCAzMDApLnN0YXJ0KCk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaW5wdXQua2V5Ym9hcmQuaXNEb3duKDMyKSB8fCB0aGlzLmlucHV0LmtleWJvYXJkLmlzRG93bigxMykpIHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU92ZXI7XG4iLCJmdW5jdGlvbiBNYWluTWVudSgpIHt9XG5cbk1haW5NZW51LnByb3RvdHlwZSA9IHtcbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwYWNlLCBmYWRlSW4sIHRpdGxlLCBidXR0b24sIGJ1dHRvbkJnO1xuICAgIHNwYWNlID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdzcGFjZScpO1xuICAgIHNwYWNlLmFscGhhID0gMDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYmlnIHRpdGxlXG4gICAgdGl0bGUgPSB0aGlzLmFkZC5iaXRtYXBUZXh0KHRoaXMud29ybGQuY2VudGVyWCwgMTAwLCAnQXVkaW93aWRlIEdsb3cnLCAnRGVmZW5kIFRoZVxcblBsYW5ldCBNb29uJywgNjQpO1xuICAgIHRpdGxlLmFscGhhID0gMDtcbiAgICB0aXRsZS5hbGlnbiA9ICdjZW50ZXInO1xuICAgIHRpdGxlLnVwZGF0ZVRleHQoKTtcbiAgICB0aXRsZS54ID0gdGhpcy53b3JsZC5jZW50ZXJYIC0gKHRpdGxlLnRleHRXaWR0aCAvIDIpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBcInN0YXJ0IGdhbWVcIiBidXR0b25cbiAgICBidXR0b24gPSB0aGlzLmFkZC5iaXRtYXBUZXh0KHRoaXMud29ybGQuY2VudGVyWCwgNDAwLCAnQXVkaW93aWRlJywgJ1N0YXJ0IEdhbWUnLCAyMCk7XG4gICAgYnV0dG9uLmFscGhhID0gMDtcbiAgICBidXR0b24udXBkYXRlVGV4dCgpO1xuICAgIGJ1dHRvbi54ID0gdGhpcy53b3JsZC5jZW50ZXJYIC0gKGJ1dHRvbi50ZXh0V2lkdGggLyAyKTtcbiAgICBidXR0b24uaGl0QXJlYSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKC0yMCwgLTEwLCBidXR0b24ud2lkdGggKyA0MCwgYnV0dG9uLmhlaWdodCArIDIwKTtcbiAgICBidXR0b24uaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICBidXR0b24uYnV0dG9uTW9kZSA9IHRydWU7XG5cbiAgICAvLyBhZGQgYSBiYWNrZ3JvdW5kIGZvciBvdXIgcGxheSBhZ2FpbiBidXR0b25cbiAgICBidXR0b25CZyA9IHRoaXMuYWRkLmdyYXBoaWNzKCk7XG4gICAgYnV0dG9uQmcuYmVnaW5GaWxsKDB4OTk5OTk5LCAwLjEpO1xuICAgIGJ1dHRvbkJnLmFscGhhID0gMDtcbiAgICBidXR0b25CZy5kcmF3UmVjdChidXR0b24ueCAtIDIwLCBidXR0b24ueSAtIDEwLCBidXR0b24ud2lkdGggKyA0MCwgYnV0dG9uLmhlaWdodCArIDIwKTtcbiAgICBidXR0b25CZy5lbmRGaWxsKCk7XG5cbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXRPdmVyLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmFkZC50d2VlbihidXR0b25CZykudG8oeyBhbHBoYTogMSB9LCAxNTApLnN0YXJ0KCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXRPdXQuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuYWRkLnR3ZWVuKGJ1dHRvbkJnKS50byh7IGFscGhhOiAwIH0sIDE1MCkuc3RhcnQoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGJ1dHRvbi5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIGZhZGUgZXZlcnl0aGluZyBpbiwgaW4gb3JkZXJcbiAgICBmYWRlSW4gPSB0aGlzLmFkZC50d2VlbihzcGFjZSkudG8oeyBhbHBoYTogMSB9LCA1MDApO1xuICAgIGZhZGVJbi5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmFkZC50d2Vlbih0aXRsZSkudG8oeyBhbHBoYTogMSB9LCA1MDApLnN0YXJ0KCk7XG4gICAgICB0aGlzLmFkZC50d2VlbihidXR0b24pLnRvKHsgYWxwaGE6IDEgfSwgNTAwKS5zdGFydCgpO1xuICAgIH0sIHRoaXMpO1xuICAgIGZhZGVJbi5zdGFydCgpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlucHV0LmtleWJvYXJkLmlzRG93bigzMikgfHwgdGhpcy5pbnB1dC5rZXlib2FyZC5pc0Rvd24oMTMpKSB7XG4gICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdHYW1lJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5NZW51O1xuIiwiZnVuY3Rpb24gUHJlbG9hZGVyKCkge31cblxuUHJlbG9hZGVyLnByb3RvdHlwZSA9IHtcbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIHNldCB1cCB0aGUgcHJlbG9hZCBiYXJcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmFkZC5zcHJpdGUodGhpcy53b3JsZC5jZW50ZXJYIC0gMTUwLCB0aGlzLndvcmxkLmNlbnRlclkgLSA0LCAncHJlbG9hZGVyJyk7XG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkQmFyKTtcblxuICAgIC8vIHN0YXJ0IGxvYWRpbmcgdGhlIHJlc3Qgb2YgdGhlIGFzc2V0c1xuICAgIHRoaXMubG9hZC5pbWFnZSgnc3BhY2UnLCAnYXNzZXRzL3NwYWNlLnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgncGxhbmV0JywgJ2Fzc2V0cy9wbGFuZXQucG5nJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdjb2xvbnknLCAnYXNzZXRzL2NvbG9ueS5wbmcnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3R1cnJldCcsICdhc3NldHMvdHVycmV0LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnYnVsbGV0JywgJ2Fzc2V0cy9idWxsZXQucG5nJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdtaXNzaWxlJywgJ2Fzc2V0cy9taXNzaWxlLnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnbWlzc2lsZTInLCAnYXNzZXRzL21pc3NpbGVfZ3JlZW4ucG5nJyk7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdleHBsb3Npb24nLCAnYXNzZXRzL2V4cGxvc2lvbi5wbmcnLCA2NCwgNjQpO1xuICAgIHRoaXMubG9hZC5iaXRtYXBGb250KCdBdWRpb3dpZGUgR2xvdycsICdhc3NldHMvYXVkaW93aWRlL2dsb3cucG5nJywgJ2Fzc2V0cy9hdWRpb3dpZGUvZ2xvdy5mbnQnKTtcbiAgICB0aGlzLmxvYWQuYml0bWFwRm9udCgnQXVkaW93aWRlJywgJ2Fzc2V0cy9hdWRpb3dpZGUvc21hbGwucG5nJywgJ2Fzc2V0cy9hdWRpb3dpZGUvc21hbGwuZm50Jyk7XG4gIH0sXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnTWFpbiBNZW51Jyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZGVyO1xuIl19
