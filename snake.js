var score;
var time;

var x;
var y;
var apple_x;
var apple_y;

var delay;

var controls;
var bricks;

function init() {
  // Page open event (and so this script file) might get called again,
  // so head it off here.
  if (global.initialized) return;
  global.initialized = true;

  var countdownField = this.getField('countdown');
	
	
	score = 0;
  
  x = BRICK_OFFSET_LEFT + 40;
  y = BRICK_OFFSET_BOTTOM + 200;
  
  apple_x = BRICK_OFFSET_LEFT + 360;
  apple_y = BRICK_OFFSET_BOTTOM + 200;
	
	controls = [];
  bricks = [];
  
  global.count = 3;

  global.dir = 3;
  global.speed = 200;
  global.paused = false;

  initBricks();

  for (var i = 0; i < 7; i++) {
    controls[i] = this.getField('control' + i);
  //	controls[i].display = display.visible;
  }
	controls[0].value = ' ^ ';
	controls[1].value = ' v ';
	controls[2].value = '  < ';
	controls[3].value = '  > ';
	controls[4].value = '';
	controls[5].value = '  < ';
	controls[6].value = '  > ';
	
  countdown();
}

function initBricks() {
  for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      bricks[c][r] = {
        x: r*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        y: c*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM,
        status: 0,
        field: this.getField('brick' + c + ',' + r)
      };
    }
  }
}

function collisionDetection() {
	//If the head crashes into itself or a wall
  for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      var b = bricks[c][r];
			if ((x === b.x && y === b.y && b.status >= 1) || // If it bumps into a brick containing snake
					x < BRICK_OFFSET_LEFT   || x >= BRICK_COLUMN_COUNT*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT ||	//or if it hits a wall
					y < BRICK_OFFSET_BOTTOM || y >= BRICK_ROW_COUNT*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM) {	
				app.alert("GAME OVER");	//game over and reset variables
				score = 0;
				
				x = 40 + BRICK_OFFSET_LEFT;
				y = 200 + BRICK_OFFSET_BOTTOM;
				
				apple_x = 360 + BRICK_OFFSET_LEFT;
				apple_y = 200 + BRICK_OFFSET_BOTTOM;
				
				global.dir = 3;
				
				//wipes the board
				for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
					for (var r = 0; r < BRICK_ROW_COUNT; r++) {
						if (bricks[c][r].status >= 1) {
							bricks[c][r].status = 0;
						}
					}
				}
			}
    }
  }
	//if the apple is eaten
	if (x === apple_x &&
			y === apple_y) {
		score++;
		var pos_available = false;
		do {
			//assigns random coordinates to the new apple
			apple_x = Math.floor(Math.random() * BRICK_COLUMN_COUNT) * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
			apple_y = Math.floor(Math.random() * BRICK_ROW_COUNT) * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM;
			//checks if the new coordinates are avaliable
			if (bricks[(apple_y - BRICK_OFFSET_BOTTOM) / (BRICK_HEIGHT + BRICK_PADDING)][(apple_x - BRICK_OFFSET_LEFT) / (BRICK_WIDTH + BRICK_PADDING)].status === 0) 
				pos_available = true;
		}
		while (pos_available === false);
	}
}

var head = this.getField('head');
function drawHead() {
  // Rect changes are almost the only changes you can carry out on a
  // Field in Chrome's subset of PDF JS:
  // https://pdfium.googlesource.com/pdfium/+/chromium/2524/fpdfsdk/src/javascript/Field.cpp#2356
  head.rect = [
    x, y, x + HEAD_WIDTH, y + HEAD_HEIGHT
  ];
}

var apple = this.getField('apple');
function drawApple() {
  apple.rect = [
    apple_x,
    apple_y,
    apple_x + APPLE_WIDTH,
    apple_y + APPLE_HEIGHT
  ]
}

function drawBricks() {
  for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      if (bricks[c][r].status >= 1) {
        bricks[c][r].field.display = display.visible;
      } else {
        bricks[c][r].field.display = display.hidden;
      }
    }
  }
}

var scoreField = this.getField('score');
function drawScore() {
  scoreField.value = " Score: " + score;
}
var speedField = this.getField('speed');
function drawSpeed() {
  speedField.value = 'Speed: ' + global.speed;
}

var countdownField = this.getField('countdown');
function draw() {
  if (global.paused) {
    countdownField.display = display.visible;
    countdownField.value = 'Paused';
    return;
  }

  countdownField.display = display.hidden;
  
  //moves head
	var dx = 0;
	var dy = 0;
	switch (global.dir){
		case 0: //up
			dy = 1;
			break;
		case 1: //down
			dy = -1;
			break;
		case 2: //left
			dx = -1; 
			break;
		case 3: //right
			dx = 1;
			break;
	}
  x += dx * (BRICK_WIDTH + BRICK_PADDING);
  y += dy * (BRICK_HEIGHT + BRICK_PADDING);


  drawBricks();
  drawApple();
  drawHead();
  drawScore();
  drawSpeed();


	collisionDetection();

	
	bricks[(y - BRICK_OFFSET_BOTTOM) / (BRICK_HEIGHT + BRICK_PADDING)][(x - BRICK_OFFSET_LEFT) / (BRICK_WIDTH + BRICK_PADDING)].status = score + 3;
	
	for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      if (bricks[c][r].status >= 1) {
        bricks[c][r].status--;
      }
    }
  }
}

// This 'whole' thing blanks out the whole screen while we render,
// because Chrome doesn't expect us to actually move objects around,
// so if you do it naively you get terrible artifacts. Breaks Acrobat,
// though (or at least they're too slow for this to work nicely).
var whole = this.getField('whole');
function wrappedDraw() {
  try {
    whole.display = display.visible;
    draw();
    whole.display = display.hidden;

  } catch (e) {
    app.alert(e.toString())
  }
	
	app.setTimeOut('wrappedDraw()', global.speed);
}

function start() {
  // TODO Some kind of speed regulation.
	wrappedDraw();
}

function countdown() {
  countdownField.value = global.count.toString();

  global.count--;
  if (global.count < 0) {
    start();
  } else {
    app.setTimeOut('countdown()', 1000);
  }
}

init();