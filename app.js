// headshot image
var headshot = new Image();
headshot.src = "images/headshot.png";

var docwidth = document.width;
var docheight = document.body.scrollHeight;

var headshot = document.querySelector("#headshot");
var headshot_x = Math.floor(docwidth / 2);
var headshot_y = -100;
var vy = 1;
var g = 0.3;
var bounced = false;
bouncecount = 0;

var stop_height;

if (window.matchMedia("(max-width: 700px)").matches) {
  stop_height = 0.43 * docheight;
} else if (window.matchMedia("(min-width: 700px)").matches) {
  stop_height = 0.43 * docheight;
}

console.log(stop_height);

function updateheadshot() {
  updatey();
  headshot.style.top = headshot_y + "px";
}

function updatey() {
  if (bouncecount < 4) {
    headshot_y += vy;

    vy += g;

    bounce();
  }
}

function bounce() {
  if (headshot_y > stop_height && bounced == false) {
    vy = -vy * 0.6;
    bounced = true;
    bouncecount++;
  } else if (bounced == true) {
    bounced = false;
  }
}

setInterval(updateheadshot, 10);
