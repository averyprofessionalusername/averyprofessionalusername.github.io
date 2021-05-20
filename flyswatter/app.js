////////////////////////////////////////////////////////////////////////////////////////////////
///// Quick alert to let the user know if theyre on mobile it might not work properly

if (window.matchMedia("(max-width: 700px)").matches) {
  alert(
    "Heads up! this page wasn't designed for mobile, but feel free to give it a shot anyway."
  );
}

//pi
const pi = Math.PI;

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////CLASSES//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

class PauseButton {
  constructor(button_object, inner, row) {
    this.button = button_object;
    this.inner = inner;
    this.row = row;
  }
}

class Weapon {
  constructor(x_pos, y_pos, hit_img, pass_img, size) {
    this.x = x_pos;
    this.y = y_pos;
    this.hit_img = hit_img;
    this.pass_img = pass_img;
    this.size = size;
  }
}

class Fly {
  constructor(
    x_pos,
    y_pos,
    up_img,
    down_img,
    left_img,
    right_img,
    vel,
    angle,
    modify_angle,
    size
  ) {
    this.x = x_pos;
    this.y = y_pos;
    this.img1 = up_img;
    this.img2 = down_img;
    this.img3 = left_img;
    this.img4 = right_img;
    this.vel = vel;
    this.angle = angle;
    this.modang = modify_angle;
    this.size = size;
  }

  angler() {
    console.log("angler called");
    return 0.4 * Math.random() - 0.2;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////VARIABLES//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var draw_interval_ID;
var angler_interval_ID;
var bounce_interval_ID;

var resume_btn = new PauseButton(
  document.createElement("button"),
  "Resume Game",
  "4/5"
);

resume_btn.button.onclick = resume;

var restart_btn = new PauseButton(
  document.createElement("button"),
  "Restart Game",
  "5/6"
);

restart_btn.button.onclick = restart;

var weapon_btn = new PauseButton(
  document.createElement("button"),
  "Choose Weapon",
  "6/7"
);

weapon_btn.button.onclick = weaponscreen;

var bat_btn = new PauseButton(
  document.createElement("button"),
  "Baseball Bat",
  "4/5"
);

bat_btn.button.onclick = batSelect;

var spat_btn = new PauseButton(
  document.createElement("button"),
  "Spatula",
  "5/6"
);

spat_btn.button.onclick = spatSelect;

var arena_btn = new PauseButton(
  document.createElement("button"),
  "Choose Arena",
  "7/8"
);

arena_btn.button.onclick = arenascreen;

var kitchen_btn = new PauseButton(
  document.createElement("button"),
  "Kitchen",
  "4/5"
);

kitchen_btn.button.onclick = kitchenSelect;

var bathroom_btn = new PauseButton(
  document.createElement("button"),
  "Bathroom",
  "5/6"
);

bathroom_btn.button.onclick = bathroomSelect;

var controls_btn = new PauseButton(
  document.createElement("button"),
  "View Controls",
  "8/9"
);

controls_btn.button.onclick = controlscreen;

var start_btn = new PauseButton(
  document.createElement("button"),
  "Start Game!",
  "5/6"
);

start_btn.button.onclick = startGame;

var back_btn = new PauseButton(
  document.createElement("button"),
  "Back",
  "9/10"
);

back_btn.button.onclick = backSelect;

var pause_buttons_array = [
  resume_btn,
  restart_btn,
  weapon_btn,
  arena_btn,
  controls_btn,
];

var start_buttons_array = [start_btn, weapon_btn, arena_btn, controls_btn];

var weapon_buttons_array = [bat_btn, spat_btn];

var arena_buttons_array = [kitchen_btn, bathroom_btn];

var control_buttons_array = [back_btn];

var paused = false;

//images
var fly_img = new Image();
fly_img.src = "images/fly.png";
var fly_img1 = new Image();
fly_img1.src = "images/fly_1.png";
var fly_img2 = new Image();
fly_img2.src = "images/fly_2.png";
var fly_img3 = new Image();
fly_img3.src = "images/fly_3.png";

var bat_img1 = new Image();
bat_img1.src = "images/bat_1.png";
var bat_img2 = new Image();
bat_img2.src = "images/bat.png";
var spat_img1 = new Image();
spat_img1.src = "images/Spatula.png";
var spat_img2 = new Image();
spat_img2.src = "images/Spatula_swing.png";

var splat_img = new Image();
splat_img.src = "images/splat.png";

// sounds
var punch_audio = new Audio("sounds/punch.mp3");
var splash_audio = new Audio("sounds/splash.mp3");
var swing_audio = new Audio("sounds/swing.mp3");
var swoosh_audio = new Audio("sounds/SWOOSH.mp3");
var unsheath_audio = new Audio("sounds/unsheath.mp3");

//get the canvas
var canvas = document.getElementById("mycanvas");
var container = document.getElementById("canvas-holder");
var cover = document.getElementById("cover");
//context so I can draw on it
var ctx = canvas.getContext("2d");
//size, position of canvas in relation to the viewport
var cvsrect = canvas.getBoundingClientRect();

// event listeners
document.addEventListener("keydown", keyDownHandler, false);
canvas.addEventListener("mousemove", mousehandler, false);
canvas.addEventListener("mousedown", clickdownhandler, false);
canvas.addEventListener("mouseup", clickuphandler, false);

//keeps track of number of kills
var killcounter = document.getElementById("killcount");
var kills = 0;
var kill = false;

//variables to hold state of keys/mouse click etc
var spacepressed = false;
var clicked = false;
var pause = false;

var fly = new Fly(
  cvsrect.width / 2,
  cvsrect.height / 2,
  fly_img3,
  fly_img1,
  fly_img2, //right
  fly_img3,
  3,
  pi / 10,
  0,
  cvsrect.height / 5
);

var weapon = new Weapon(10, 10, bat_img1, bat_img2, cvsrect.height / 8);

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////MENU BUTTON FUNCTIONS//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

//draw the pause screen
function drawPause() {
  ctx.rect(0, 0, cvsrect.width, cvsrect.height);
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fill();
  printButtons(pause_buttons_array);
}

//weapon selector screen
function weaponscreen() {
  clearPause(container);
  printButtons(weapon_buttons_array);
}

//arena selector screen
function arenascreen() {
  clearPause(container);
  printButtons(arena_buttons_array);
}

function controlscreen() {
  clearPause(container);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Press P to Pause Game", 10, 50);
  ctx.fillText("Press Space to start and reset the fly", 10, 100);
  ctx.fillText("Use mouse to move your weapon", 10, 150);
  ctx.fillText("Left click to take a swing", 10, 200);

  printButtons(control_buttons_array);
}
function printButtons(array) {
  for (let i of array) {
    container.appendChild(i.button);
    i.button.innerHTML = i.inner;
    i.button.style.gridColumn = "3/4";
    i.button.style.gridRow = i.row;
  }
}

function clearPause(container) {
  var container_elements = container.childNodes;
  for (var i = 0; i < container_elements.length; i++) {
    if (container_elements[i].nodeName == "BUTTON") {
      container.removeChild(container_elements[i]);
      i--;
    }
  }
}

function startGame() {
  clearPause(container);
  maingame();
}

function resume() {
  paused = false;
  clearPause(container);

  maingame();
}

function restart() {
  paused = false;
  kills = 0;
  clearPause(container);
  fly.x = cvsrect.width / 2;
  fly.y = cvsrect.height / 2;

  maingame();
}

function batSelect() {
  weapon.hit_img = bat_img1;
  weapon.pass_img = bat_img2;
  clearPause(container);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (paused) {
    pausemenu();
  } else {
    startmenu();
  }
}

function spatSelect() {
  weapon.hit_img = spat_img1;
  weapon.pass_img = spat_img2;
  clearPause(container);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (paused) {
    pausemenu();
  } else {
    startmenu();
  }
}

function kitchenSelect() {
  canvas.style.backgroundImage = "url(images/kitchen.jpg";
  clearPause(container);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (paused) {
    pausemenu();
  } else {
    startmenu();
  }
}

function bathroomSelect() {
  canvas.style.backgroundImage = "url(images/bathroom.jpg";
  clearPause(container);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (paused) {
    pausemenu();
  } else {
    startmenu();
  }
}

function backSelect() {
  clearPause(container);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (paused) {
    pausemenu();
  } else {
    startmenu();
  }
}

//pause menu function
function pausemenu() {
  console.log("pausing");
  canvas.style.zIndex = -100;
  clearInterval(draw_interval_ID);
  clearInterval(angler_interval_ID);
  clearInterval(bounce_interval_ID);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.cursor = "pointer";
  drawPause();
}

function startmenu() {
  canvas.style.zIndex = -100;
  ctx.rect(0, 0, cvsrect.width, cvsrect.height);
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fill();
  printButtons(start_buttons_array);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////FUNCTIONS//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

//handles key pressed events
function keyDownHandler(e) {
  if (e.key == " ") {
    if (spacepressed == true || kill == true) {
      spacepressed = false;
      kill = false;
      fly.x = cvsrect.width / 2;
      fly.y = cvsrect.height / 2;
    } else if (spacepressed == false) {
      spacepressed = true;
    }
  } else if (e.keyCode === 80 && paused === false) {
    paused = true;
    pausemenu();
  } else if (e.keyCode === 80 && paused === true) {
    paused = false;
    resume();
  }
}

//draws weapon on the canvas
function drawWeapon() {
  ctx.beginPath();
  if (clicked) {
    ctx.drawImage(
      weapon.hit_img,
      weapon.x - weapon.size / 2,
      weapon.y - weapon.size,
      weapon.size,
      weapon.size
    );
  } else {
    ctx.drawImage(
      weapon.pass_img,
      weapon.x - weapon.size / 2,
      weapon.y - weapon.size / 2,
      weapon.size,
      weapon.size
    );
  }
  ctx.closePath();
}

//draws the fly on to the canvas
function drawFly() {
  if (fly.angle < 0) {
    fly.angle += 2 * pi;
  } else if (fly.angle > 2 * pi) {
    fly.angle -= 2 * pi;
  }

  ctx.beginPath();
  if (kill == false) {
    if (fly.angle < pi / 4 || fly.angle > (7 * pi) / 4) {
      ctx.drawImage(
        fly.img3,
        fly.x - fly.size / 2,
        fly.y - fly.size / 2,
        fly.size,
        fly.size
      );
    } else if (fly.angle >= pi / 4 && fly.angle < (3 * pi) / 4) {
      ctx.drawImage(
        fly.img2,
        fly.x - fly.size / 2,
        fly.y - fly.size / 2,
        fly.size,
        fly.size
      );
    } else if (fly.angle >= (3 * pi) / 4 && fly.angle < (5 * pi) / 4) {
      ctx.drawImage(
        fly.img1,
        fly.x - fly.size / 2,
        fly.y - fly.size / 2,
        fly.size,
        fly.size
      );
    } else if (fly.angle >= (5 * pi) / 4 && fly.angle <= (7 * pi) / 4) {
      ctx.drawImage(
        fly.img4,
        fly.x - fly.size / 2,
        fly.y - fly.size / 2,
        fly.size,
        fly.size
      );
    }
  } else if (kill == true) {
    ctx.drawImage(splat_img, fly.x - 50, fly.y - 50, 100, 100);
  }
  ctx.closePath();
}

function kill_the_fly() {
  splash_audio.play();
  spacepressed = false;
  kill = true;
  kills += 1;
  writekills();
}

function writekills() {
  //killcounter.innerHTML = `${kills}`;
}

//sets weapon position to position of mouse (relative to canvas)
function mousehandler(e) {
  weapon.x = e.x - cvsrect.left;
  weapon.y = e.y - cvsrect.top;
}

function clickdownhandler(e) {
  swing_audio.play();
  clicked = true;
  if (
    Math.sqrt(Math.pow(weapon.x - fly.x, 2) + Math.pow(weapon.y - fly.y, 2)) <=
      30 &&
    spacepressed == true
  ) {
    kill_the_fly();
  }
}

function clickuphandler(e) {
  clicked = false;
}

function bouncecircle() {
  if (fly.y <= 0) {
    fly.angle = pi / 2;
  }
  if (fly.y >= cvsrect.height) {
    fly.angle = -pi / 2;
  } else if (fly.x <= 0 || fly.x >= cvsrect.width) {
    fly.angle = pi - fly.angle;
  }
}

function draw() {
  //reset bounding client rect in case of variable viewport
  cvsrect = canvas.getBoundingClientRect();

  canvas.style.cursor = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (spacepressed) {
    console.log("spacepressed");
    fly.angle += fly.modang;
    fly.y += fly.vel * Math.sin(fly.angle);
    fly.x += fly.vel * Math.cos(fly.angle);
  }
  drawFly();
  drawWeapon();
}

function updateAngle() {
  fly.modang = fly.angler();
}

//main game function
function maingame() {
  canvas.style.zIndex = 10;
  draw_interval_ID = setInterval(draw, 10);
  angler_interval_ID = setInterval(updateAngle, 250);
  bounce_interval_ID = setInterval(bouncecircle, 50);
}

startmenu();
