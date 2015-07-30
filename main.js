//console.log("beginning");
var gamejs = require('gamejs');
var font = require('gamejs/font');
var mask = require('gamejs/mask');
var screenWidth = 2600;
var screenHeight = 1300;
var spriteSize = 128;
var numSprites = 1;
var up = 1, down = 2, left = 4, right = 8, canChange = 16; formChange = 32;
var forms = [];
var timeBetweenHits = 300;
var timeSinceHit = 0;
var activeGame = true;
var defaultFont = new font.Font("30px Arial");
var bestTwoOutOfThree = false;
var player1Score = 0;
var player1;
var count = 0;
var posArrX = [];
var posArrY = [];
var plantArr = [];
var numFood = 10;

console.log("middleish");
var checkOverlap = function(player1){
  var foodSize = 30;
  var x;
  var y;
  var px;
  var py;
  for(var counter = 0; counter <= numFood; counter++  ){
    x = posArrX[counter];
    y = posArrY[counter];
    px = player1.placement;
    py = player1.yPlacement;
    if ((px > x && px < x + spriteSize)||(px+foodSize > x && px+foodSize < x + spriteSize)){
      if ((py > y && py < y+ spriteSize)||(py+foodSize > y && py+foodSize < y + spriteSize)){
        posArrX[counter]= -10;
        posArrY[counter] = -10;  
        plantArr[counter].placementx = -10;
        plantArr[counter].placementy = -10;    
        player1.hunger += 0.5;      
      };
    };
  };
};
var makePositions = function(){
 // console.log("makepos called");
  for(this.counter = 0; this.counter<=numFood; this.counter ++){
      posArrX[this.counter] = Math.floor(Math.random() * 2000);
      posArrY[this.counter] = Math.floor(Math.random() * 1400);

  };
};

var generatePlants =  function(){
//  console.log("generateplants called");
  makePositions();
 
  for (this.counter = 0; this.counter <= numFood; this.counter++){
    var p = new Plant(posArrX[this.counter], posArrY[this.counter]);
    //console.log("x "+ posArrX[this.counter] + "y " + posArrY[this.counter]);
     plantArr[this.counter] = p;
  };

//return plantArr;
  };


//}

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
function Plant(placementx, placementy){
  this.placementx = placementx;
  this.placementy = placementy;
};

function Animal(placementx, placementy){
  this.placementx = placementx;
  this.placementy = placementy;
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
    if (this.yPlacement < 1180) {
      this.yPlacement += 14;
    }
  };
  if(this.mask & left){
    if(this.placement > 0){
      this.placement = this.placement - 14;
    }
  }else if(this.mask & right){
    if(this.placement < 2500){
      this.placement = this.placement + 14;
    }
  }
  if(this.hit===true){
    this.health = this.health -3;
    this.hit = false;
  };
};

Player.prototype.draw = function(display) {
 // console.log("draw player");
  display.blit(this.form.image, [this.placement, this.yPlacement]);
  var counterMain = 0;
   var image = gamejs.image.load('Nutalmond.png');
    while (counterMain < numFood){

     counterMain++;
      //console.log("loop" + counterMain);
        plantArr[counterMain].draw(display, image);
     };
};
Plant.prototype.draw = function(display, image) {
  if (this.placementx >= 0){
 // console.log("draw plant");
  display.blit(image, [this.placementx, this.placementy]);
}
};
function main() {
  //console.log("main");
  var counterMain = 0;
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
generatePlants();

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

      display.blit(defaultFont.render("You have died", "#000000"), [0, 90]);

    }
   }

   if (player1.population < 0){
     activeGame = false;

     display.blit(defaultFont.render("You have died", "#000000"), [0, 90]);

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

     display.blit(defaultFont.render("Hunger: " + player1.hunger, "#000000"), [135, 0]);
     display.blit(defaultFont.render("Population:" + player1.level*100, "#000000"), [320, 0]);
      display.blit(defaultFont.render("Level: " + player1.level, "#000000"), [0, 0]);

<<<<<<< HEAD
      player1.draw(display, arr);


=======
      player1.draw(display);
   
     checkOverlap(player1);
>>>>>>> aeb9bf6270f2c70e60294c1cb91b8f881ed7f73e


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
  //console.log("fpsCallback");
};
gamejs.preload(['caveman1.png']);
gamejs.preload(['Nutalmond.png']);
gamejs.preload(['Berries.png']);
gamejs.preload(['Plant.png']);
gamejs.ready(main);

var caveman = "caveman1.png";

// target position
var chaser = {
  x: 5,
  y: 7
};

// my position
var caveman1 = {
  x: 9,
  y: 9
};

// subtract (= difference vector)
var dx = c.x - caveman1.x;
var dy = c.y - caveman1.y;

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
caveman1.x += dx * delta * SPEED;
caveman.y += dy * delta * SPEED;
