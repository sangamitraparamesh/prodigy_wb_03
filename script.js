// ==========================
// TIC TAC TOE GAME LOGIC
// ==========================
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const turnText = document.getElementById("turn");
const restartBtn = document.getElementById("restart");

let current = "X";
let grid = Array(9).fill("");
let gameOver = false;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function drawBoard(){
  board.innerHTML = "";
  grid.forEach((val,i)=>{
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.textContent = val;
    if(val === "X") cell.classList.add("x");
    if(val === "O") cell.classList.add("o");
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  });
}

drawBoard();

function handleClick(e){
  if(gameOver) return;
  const idx = e.target.dataset.index;
  if(grid[idx] !== "") return;

  grid[idx] = current;
  drawBoard();

  if(checkWin()){
    statusText.innerHTML = `${current} Wins! 🎉`;
    gameOver = true;
    highlightWin();
    startConfetti();
    return;
  }

  if(grid.every(c => c!=="")){
    statusText.textContent = "Draw!";
    gameOver = true;
    return;
  }

  current = current === "X" ? "O" : "X";
  turnText.textContent = current;
}

function checkWin(){
  return wins.some(w=> w.every(i=> grid[i]===current));
}

function highlightWin(){
  wins.forEach(w=>{
    if(w.every(i=> grid[i]===current)){
      w.forEach(i=>{
        board.children[i].classList.add("winner");
      });
    }
  });
}

restartBtn.addEventListener("click",()=>{
  grid = Array(9).fill("");
  current = "X";
  gameOver = false;
  statusText.innerHTML = "Current: <strong id='turn'>X</strong>";
  turnText.textContent = "X";
  drawBoard();
});

// ==========================
// CONFETTI EFFECT
// ==========================
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
confettiCanvas.width = innerWidth;
confettiCanvas.height = innerHeight;

let confettiPieces = [];

function startConfetti(){
  for(let i=0;i<120;i++){
    confettiPieces.push({
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight - innerHeight,
      s: Math.random()*6+4,
      c: pastelColor(),
      v: Math.random()*3+2
    });
  }
}

function pastelColor(){
  const colors = ["#ffb3c6","#b3e5ff","#c8ffc8","#fff0b3","#ffd6e0","#e6f7ff"];
  return colors[Math.floor(Math.random()*colors.length)];
}

function animateConfetti(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  confettiPieces.forEach(p=>{
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x,p.y,p.s,p.s);
    p.y += p.v;
  });
  confettiPieces = confettiPieces.filter(p=> p.y < innerHeight+20);
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ==========================
// FLOATING X/O BACKGROUND
// ==========================
const bgCanvas = document.getElementById("bgCanvas");
const bg = bgCanvas.getContext("2d");
bgCanvas.width = innerWidth;
bgCanvas.height = innerHeight;

let floats = [];
for(let i=0;i<200;i++){
  floats.push({
    char: Math.random()>0.5 ? "X" : "O",
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    size: Math.random()*32+16,
    speed: Math.random()*0.6+0.2,
    alpha: Math.random()*0.5+0.2,
    rot: Math.random()*360,
    rotSpeed: Math.random()*1-0.5
  });
}

function animateBG(){
  bg.clearRect(0,0,innerWidth,innerHeight);
  bg.font = "bold 30px Arial";

  floats.forEach(f=>{
    bg.save();
    bg.globalAlpha = f.alpha;
    bg.translate(f.x,f.y);
    bg.rotate(f.rot*Math.PI/180);
    bg.font = `bold ${f.size}px Arial`;
    bg.fillStyle = "#e2e2f9";
    bg.fillText(f.char,0,0);
    bg.restore();

    f.y -= f.speed;
    f.rot += f.rotSpeed;
    if(f.y < -40){
      f.y = innerHeight+40;
      f.x = Math.random()*innerWidth;
    }
  });

  requestAnimationFrame(animateBG);
}
animateBG();
