console.log("beginning");
var gamejs = require('gamejs');
var font = require('gamejs/font');
var mask = require('gamejs/mask');
var screenWidth = 2100;
var screenHeight = 1500;
var spriteSize = 128;
var numSprites = 1;
var up = 1, down = 2, left = 4, right = 8, canChange = 16; formChange = 32;
var forms = [];
var timeBetweenHits = 300;
var timeSinceHit = 0;
var activeGame = true;
var defaultFont = new font.Font("40px Arial");
var bestTwoOutOfThree = false;
var player1Score = 0;
var player1;
var count = 0;
console.log("asdljfa");
function Player(placement, formIndex){
  this.placement = placement;
  this.yPlacement = 80;
  this.hunger = 10;
  this.level = 1;
  this.range = 1;
  this.form = forms[formIndex];
  this.mask = 16;
  this.hit = false;
  this.health = 30;
};
Player.prototype.changeForm = function(index) {
  this.form = forms[index];
};

Player.prototype.update = function(msDuration) {
  if(this.mask & up){
    if (this.yPlacement > 0) {
      this.yPlacement -= 14;
    }
  }
  if(this.mask & down){
    if (this.yPlacement < 470) {
      this.yPlacement += 14;
    }
  };
  if(this.mask & left){
    if(this.placement > 0){
      this.placement = this.placement - 14;
    }
  }else if(this.mask & right){
    if(this.placement < 1000){
      this.placement = this.placement + 14;
    }
  }
  if(this.hit===true){
    this.health = this.health -3;
    this.hit = false;
  };
};

Player.prototype.draw = function(display) {
  display.blit(this.form.image, [this.placement, this.yPlacement]);
};

function main() {
  var display = gamejs.display.setMode([screenWidth, screenHeight]);
  var sprites = gamejs.image.load('caveman1.png');
  var surfaceCache = [];
  var maskCache = [];
  for (var i = 0; i < numSprites; i++){
    var surface = new gamejs.Surface([spriteSize, spriteSize]);
    var rect = new gamejs.Rect(spriteSize*i, 0, spriteSize, spriteSize);
    var imgSize = new gamejs.Rect(1, 1, spriteSize, spriteSize);
    surface.blit(sprites, imgSize, rect);
    surfaceCache.push(surface);
    var maskCacheElement = mask.fromSurface(surface);
    maskCache.push(maskCacheElement);
  };
  forms = [
    {index: 0,
      image: surfaceCache[0],
      mask: maskCache[0]},
      /*
    {index: 1,
      image: surfaceCache[1],
      mask: maskCache[1]},
    {index: 2,
      image: surfaceCache[2],
      mask: maskCache[2]},
    {index: 3,
      image: surfaceCache[3],
      mask: maskCache[3]}
      */
  ];

  function handleEvent(event) {
    if(event.type === gamejs.event.KEY_DOWN){
     if(event.key === gamejs.event.K_w){
        player1.mask |= up;
        player1.mask &= ~down;
      }else if(event.key === gamejs.event.K_s){
        player1.mask |= down;
        player1.mask &= ~up;
      }else if(event.key === gamejs.event.K_a){
        player1.mask |= left;
        player1.mask &= ~right;
      }else if(event.key === gamejs.event.K_d){
        player1.mask |= right;
        player1.mask &= ~left;
      }
    } else if(event.type === gamejs.event.KEY_UP){
    if(event.key === gamejs.event.K_w){
        player1.mask &= ~up;
      }else if(event.key === gamejs.event.K_a){
        player1.mask &= ~left;
      }else if(event.key === gamejs.event.K_s){
        player1.mask &= ~down;
      }else if(event.key === gamejs.event.K_d){
        player1.mask &= ~right;
      }
    }
  };
var count = 0;
//console.log("asdljfa");
 function gameTick(msDuration) {
   // console.log("hi");
   count++;
   if (count>= 100){
    count = 0;
    player1.hunger -= 0.5;
    if (player1.hunger < 0){
      activeGame = false;

      display.blit(defaultFont.render("You have died", "#000000"), [10, 470]);

    }
   }
    if(activeGame){
      gamejs.event.get().forEach(function(event) {
        handleEvent(event);
      });
      display.clear();

      if(timeSinceHit > timeBetweenHits){
        var hasMaskOverlap = false;
        if (hasMaskOverlap) {

        };
      }else{
        timeSinceHit +=msDuration;
      };


     player1.update(msDuration);

     display.blit(defaultFont.render("Hunger:" + player1.hunger, "#000000"), [10, 510]);
     // display.blit(defaultFont.render("Population:" + player1.level*100, "#000000"), [400, 0]);
      display.blit(defaultFont.render("Level: " + player1.level, "#000000"), [10, 550]);

      player1.draw(display);


/*
      player1.draw(display);

      if(player1.health === 0 ){
        activeGame = false;

        if (player1.health === 0){
          display.blit(defaultFont.render("Player 1 Defeated", "#000000"), [0, 320]);
          player1Score--;
        }
/*
        if (!bestTwoOutOfThree) {
          var confirmMoreGame = confirm("Best two out of three?");
          if (confirmMoreGame) {
            restart();
            bestTwoOutOfThree = true;
          }
        } else if ((player1Score > -2) && (player1Score < 2)) {
          var confirmContinue = confirm("Continue?");
          if (confirmContinue) {
            restart();
          }
        } else {
          var confirmExtraGames = confirm("One player died. More game?");
          if (confirmExtraGames) {
            location.reload();
          }
        }
*/
      //};
    };
  };
  var player1 = new Player(0, 0);

  gamejs.time.fpsCallback(gameTick, this, 60);
  console.log("fpsCallback");
};
gamejs.preload(['caveman1.png']);
gamejs.ready(main);

var caveman = "fireicewater.png";

// target position
var c = {
  x: 5,
  y: 7
};

// my position
var caveman = {
  x: 9,
  y: 9
};

// subtract (= difference vector)
var dx = c.x - caveman.x;
var dy = c.y - caveman.y;

// normalize (= direction vector)
// (a direction vector has a length of 1)
var length = Math.sqrt(dx * dx + dy * dy);
if (length) {
  dx /= length;
  dy /= length;
}

// move
// delta is the elapsed time in seconds
// SPEED is the speed in units per second (UPS)
caveman.x += dx * delta * SPEED;
caveman.y += dy * delta * SPEED;
