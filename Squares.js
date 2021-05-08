const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let friction = 0.9;

//CHARACTER:
class Player {
    constructor(x, y, w, h, vx, vy, c, j) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.color = c;
        this.jumping = j;
    }
    draw() {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.w, this.h);
    }
    canvasCollision() {
        if (this.x <= 0) this.x = 0;
        if (this.y <= 0) this.y = 0;
        if (this.x + this.w >= canvas.width) this.x = canvas.width - this.w;
        if (this.y + this.h >= canvas.height) {this.y = canvas.height - this.h; this.vy = 0; this.jumping = false};
    }
    update() {
        this.draw(); 
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= friction;
        this.vy *= friction;
        this.canvasCollision() //must be after other updates
    }
}

let player1 = new Player(canvas.width/2, canvas.height/2 + 75, 75, 75, 0, 0, 'darkgrey', false); 
let player2 = new Player(75, canvas.height/2 + 75, 75, 75, 0, 0, '#8DAA9D', false); 


function controlPlayer1(obj) {
    //this order matters. If update is before jump then obj won't jump when on top of other block.
    if (controller1.up1 && !obj.jumping) { obj.vy -= 25; obj.jumping = true };
    if (controller1.left1) { obj.vx -= 0.5 };
    if (controller1.right1) { obj.vx += 0.5 };
    obj.update();
}

function controlPlayer1(obj) {
    //this order matters. If update is before jump then obj won't jump when on top of other block.
    if (controller1.up1 && !obj.jumping) { obj.vy -= 25; obj.jumping = true };
    if (controller1.left1) { obj.vx -= 0.5 };
    if (controller1.right1) { obj.vx += 0.5 };
    obj.update();
}

function controlPlayer2(obj) {
    if (controller2.up2 && !obj.jumping) { obj.vy -= 25; obj.jumping = true };
    if (controller2.right2) { obj.vx += 0.5 };
    if (controller2.left2) { obj.vx -= 0.5 };
    obj.update();
}

//MOVEMENT:
class Controller {
    constructor() {
        this.left1  = false;
        this.up1    = false;
        this.right1 = false;

        this.left2  = false;
        this.up2    = false;
        this.right2 = false;

        this.down  = false;

        let controller1 = (e) => {
            if (e.code === 'ArrowRight') { this.right1 = e.type === 'keydown' }
            if (e.code === 'ArrowLeft')  { this.left1 = e.type === 'keydown' }
            if (e.code === 'ArrowUp')    { this.up1 = e.type === 'keydown' }   
            if (e.code === 'ArrowDown')      { this.down = e.type === 'keydown' }          
        }
        
        let controller2 = (e) => {
            if (e.code === 'KeyD')   { this.right2 = e.type === 'keydown' }
            if (e.code === 'KeyA')   { this.left2 = e.type === 'keydown' }
            if (e.code === 'KeyW')   { this.up2 = e.type === 'keydown' }    
            if (e.code === 'KeyS')  { this.down = e.type === 'keydown' }         
        }  

    window.addEventListener('keydown', controller1);
    window.addEventListener('keyup', controller1);
    window.addEventListener('keydown', controller2);
    window.addEventListener('keyup', controller2);
    }
}

let controller1 = new Controller();
let controller2 = new Controller();

//COLLISION DETECTION
function collisionDetection(obj, obj2){
 //center point of each side of obj1
 let objLeft = {x: obj.x,  y: obj.y + obj.h/2};
 let objTop = {x: obj.x + obj.w/2, y: obj.y};
 let objRight = {x: obj.x + obj.w, y: obj.y + obj.h/2};
 let objBottom = {x: obj.x + obj.w/2, y: obj.y + obj.h};
 //center point of each side a obj2
 let obj2Left = {x: obj2.x, y: obj2.y + obj2.h/2};
 let obj2Top = {x: obj2.x + obj2.w/2, y: obj2.y};
 let obj2Right = {x: obj2.x + obj2.w, y: obj2.y + obj2.h/2};
 let obj2Bottom = {x: obj2.x + obj2.w/2, y: obj2.y + obj2.h};
 //distance between obj1 and obj2 opposing sides
 let rightDistX = objRight.x - obj2Left.x;
 let rightDistY = objRight.y - obj2Left.y;
 let leftDistX = objLeft.x - obj2Right.x;
 let leftDistY = objLeft.y - obj2Right.y;
 let topDistX =  objTop.x - obj2Bottom.x;
 let topDistY = objTop.y - obj2Bottom.y;
 let bottomDistX = objBottom.x - obj2Top.x;
 let bottomDistY = objBottom.y - obj2Top.y;
 //pythagorean theorem for distance. dRight is from the right side of obj1 to the left of obj2. the rest follow suit.
 let dRight = Math.sqrt(rightDistX*rightDistX + rightDistY*rightDistY);
 let dLeft = Math.sqrt(leftDistX*leftDistX + leftDistY*leftDistY);
 let dTop = Math.sqrt(topDistX*topDistX + topDistY*topDistY);
 let dBottom = Math.sqrt(bottomDistX*bottomDistX + bottomDistY*bottomDistY);
 //Math.min return the smallest value thus variable minimum will be which ever sides are closest together
 let minimum = Math.min(dRight, dLeft, dBottom, dTop);
 let val = 0;
 //compare minimum to pythagorean theorem and set val based on which ever side is closest
 if (dTop == minimum) {
  val = 1;
  //the context stuff can be deleted. It's just here for visual. The if statements can be one line each.
  context.lineWidth = 2;
  context.strokeStyle = 'blue';
  context.beginPath();
  context.moveTo(objTop.x, objTop.y); 
  context.lineTo(obj2Bottom.x, obj2Bottom.y);
  context.stroke();
}
else if (dRight == minimum) {
  val = 2;
  context.strokeStyle = 'orange';
  context.beginPath();
  context.moveTo(objRight.x, objRight.y); 
  context.lineTo(obj2Left.x, obj2Left.y);
  context.stroke();
}
else if (dBottom == minimum) {
  val = 3;
  context.strokeStyle = 'green';
  context.beginPath();
  context.moveTo(objBottom.x, objBottom.y); 
  context.lineTo(obj2Top.x, obj2Top.y);
  context.stroke();
}
else if (dLeft == minimum) {
  val = 4;
  context.strokeStyle = 'pink';
  context.beginPath();
  context.moveTo(objLeft.x, objLeft.y); 
  context.lineTo(obj2Right.x, obj2Right.y);
  context.stroke();
}
 //pass the objects and val 
 collisionAction(obj, obj2, val);
}

//ACTION
function collisionAction(obj, obj2, val){
//player1 top to player2 bottom
if (obj.y <= obj2.y + obj2.h && obj2.y + obj2.h >= obj.y && val == 1) {
  obj2.y = obj.y - obj2.h; 
  obj.y = obj2.y + obj2.h;
  obj2.vy = 0;
  obj2.jumping = false;
  obj.jumping = true;
}
//player1 right to player2 left
if (obj.x + obj.w >= obj2.x && obj2.x <= obj.x + obj.w && val == 2) {
  obj2.x = obj.x + obj.w;
  obj.x = obj2.x - obj.w - 1;
  obj2.vx = 0;
}
//player1 bottom to player2 top
if (obj.y + obj.h >= obj2.y && obj2.y <= obj.y + obj.h && val == 3) {
  obj.y = obj2.y - obj.h;
  obj2.y = obj.y + obj.h;
  obj.vy = 0;
  obj.jumping = false;
  obj2.jumping = true;
}
//player1 left to player2 right
if (obj.x <= obj2.x + obj2.w && obj2.x + obj2.w >= obj.x && val == 4) {
  obj2.x = obj.x - obj2.w;
  obj.x = obj2.x + obj2.w + 1;
  obj.vx = 0;
  obj2.vx = 0;
}
}

function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height); 
  context.fillStyle = 'grey';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //PLAYER
  controlPlayer1(player1); 
  controlPlayer2(player2);
  
  collisionDetection(player1, player2)

  requestAnimationFrame(loop)
}
loop();
