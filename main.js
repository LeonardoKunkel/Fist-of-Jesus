
const canvas = document.getElementById( "myCanvas" );
const ctx = canvas.getContext( "2d" );

let frames = 0;
let requestId;

let mainAudio = new Audio();
mainAudio.src = 'assets/audio/mainTheme.mp3'

const enemies = [];
const imagesEnemies = [
    'assets/images/zombie1.png',
    'assets/images/zombie2.png',
    'assets/images/zombie3.png',
    'assets/images/zombie4.png',
    'assets/images/zombie5.png',
    'assets/images/zombie6.png',
    'assets/images/zombie7.png',
    'assets/images/zombie8.png',
];
let bullets = [];
let time = 45;
let intervalId = null

class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image1 = new Image();
        this.image1.src = "assets/images/background.png"
        this.image2 = new Image();
        this.image2.src = "assets/images/gameOver.jpeg"
        this.image3 = new Image();
        this.image3.src = "assets/images/youWin.jpeg"
        this.win = false
    }
    draw() {
        if(this.win) {
            ctx.fillStyle = "white"
            ctx.font = "80px Alagard";
            ctx.fillText("Jesus stand alive!", 325, 150);
            ctx.drawImage(this.image3, 50, 300, 900, 500);
            clearInterval(intervalId)
        } else {
            ctx.drawImage( this.image1, this.x, this.y, this.width, this.height );
        }
    }
    gameOver() {
        clearInterval(intervalId)
        ctx.fillStyle = "white"
        ctx.font = "80px Alagard";
        ctx.fillText("Jesus is dead!", 325, 150)
        ctx.drawImage(this.image2, 50, 300, 900, 500)
    }
    youWin() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"
        ctx.font = "80px Alagard";
        ctx.fillText("Jesus stand alive!", 325, 150);
        ctx.drawImage(this.image3, 50, 300, 900, 500);
    }
}

class Character {
    constructor( x, y, w, h, img ) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.image = new Image()
        this.image.src = img
    }
    draw() {
        ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
    }
    collision( item ) {
        return(
            this.x < item.position.x + item.width &&
            this.x + this.width > item.position.x &&
            this.y < item.position.y + item.height &&
            this.y + this.height > item.position.y
        )
    }
}

class HolyGrail extends Character {
    constructor( x, y, w, h ) {
        super( x, y, w, h )
        this.image = new Image();
        this.image.src = "assets/images/holyGrail.png"
    }
    draw() {
        ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
    }
    collision( item ) {
        return(
            this.x < item.position.x + item.width &&
            this.x + this.width > item.position.x &&
            this.y < item.position.y + item.height &&
            this.y + this.height > item.position.y
        )
    }
}

class Defender extends Character {
    constructor( x, y, w, h ) {
        super( x, y, w, h )
        this.image1 = new Image();
        this.image1.src = "assets/images/jesusRight.png";
        this.image2 = new Image();
        this.image2.src = "assets/images/jesusLeft.png";
        this.image3 = new Image();
        this.image3.src = "assets/images/jesusUp.png";
        this.image4 = new Image();
        this.image4.src = "assets/images/jesusDown.png";
        this.direction = '';
        this.lives = 3;
    }
    draw() {
        switch (this.direction) {
            default:
                ctx.drawImage( this.image2, this.x, this.y, this.width, this.height );
                break;
            case 'right':
                ctx.drawImage( this.image1, this.x, this.y, this.width, this.height );
                break;
            case 'left':
                ctx.drawImage( this.image2, this.x, this.y, this.width, this.height );
                break;
            case 'up':
                ctx.drawImage( this.image3, this.x, this.y, this.width, this.height );
                break;
            case 'down':
                ctx.drawImage( this.image4, this.x, this.y, this.width, this.height );
                break;
        }
    }
}

class Attacker {
    constructor( w, h, speedX, speedY, img) {
        this.width = w;
        this.height = h;
        this.image1 = new Image();
        this.image1.src = img;
        this.position = {
            x: 0,
            y: Math.floor(Math.random() * (canvas.height - this.height))
        }
        this.speed = {
            x: speedX,
            y: (Math.random() > 0.5 ? 1 : -1) * speedY
        }
    }
    draw() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        ctx.drawImage(this.image1, this.position.x, this.position.y, this.width, this.height);
    }
}

class Bullet {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.image1 = new Image();
        this.image1.src = "assets/images/fishRight.png"
        this.image2 = new Image();
        this.image2.src = "assets/images/fishLeft.png"
        this.image3 = new Image();
        this.image3.src = "assets/images/fishUp.png"
        this.image4 = new Image();
        this.image4.src = "assets/images/fishDown.png"
        this.direction = dir;
    }
    draw() {
        switch (this.direction) {
            case 'right':
                this.x += 3;
                ctx.drawImage( this.image1, this.x, this.y, this.width, this.height );
                break;
            case 'left':
                this.x -= 3;
                ctx.drawImage( this.image2, this.x, this.y, this.width, this.height );
                break;
            case 'up':
                this.y -= 3;
                ctx.drawImage( this.image3, this.x, this.y, this.width, this.height );
                break;
            case 'down':
                this.y += 3;
                ctx.drawImage( this.image4, this.x, this.y, this.width, this.height );
                break;
        }
    }
    collision( item ) {
        return(
            this.x < item.position.x + item.width &&
            this.x + this.width > item.position.x &&
            this.y < item.position.y + item.height &&
            this.y + this.height > item.position.y
        )
    }
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.draw()
        // Sacar las balas del canvas
        if (bullet.x <= 0 || bullet.x + bullet.width >= 1000) {
            bullets.splice(index, 1)
        } else if (bullet.y <= 0 || bullet.y + bullet.height >= 800) {
            bullets.splice(index, 1)
        }
    });
}

function generarAttackers() {
    if (frames % 85 === 0 || frames % 600 === 0) {
        let imgR = Math.floor(Math.random() * imagesEnemies.length);
        const attacker = new Attacker(80, 80, 2, 2, imagesEnemies[imgR]);
        enemies.push(attacker)
    }
    enemies.forEach((attacker, attacker_index) => {
        attacker.draw()
        if(holy.collision(attacker)) {
            requestAnimationFrame = undefined;
            fondo.gameOver();
        }
        if(defender.collision(attacker)) {
            enemies.splice(attacker_index, 1);
            defender.lives -= 1;
        }
        if (defender.lives < 0) {
            requestAnimationFrame = undefined;
            fondo.gameOver();
        }
        bullets.forEach((bull, bull_index) => {
            if(bull.collision(attacker)) {
                enemies.splice(attacker_index, 1);
                bullets.splice(bull_index, 1);
            }
        });
        if(attacker.position.x < 0 || attacker.position.x + attacker.width >= canvas.width ) {
            attacker.speed.x = -attacker.speed.x;
        } else if(attacker.position.y < 0 || attacker.position.y + attacker.height >= canvas.height) {
            attacker.speed.y = -attacker.speed.y;
        }
    });
}

function drawTimeAndLives() {
    ctx.fillStyle = "white";
    ctx.font = "32px Alagard"
    ctx.fillText(`Lives: ${defender.lives}`, 50, 35)
    ctx.fillStyle = "white";
    ctx.font = "32px Alagard"
    ctx.fillText(`Time: ${time}`, 800, 35)
}

const fondo = new Background();
const holy = new HolyGrail( 500, 400, 58, 70 );
const defender = new Defender( 500, 600, 95, 120 );

function startCanvas() {
    if(fondo.win) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fondo.draw();
    } else {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fondo.draw();
        holy.draw();
        defender.draw();
        drawTimeAndLives()
        drawBullets();
        generarAttackers();
        if(requestId) {
            requestId = requestAnimationFrame(startCanvas);
        }
    }
}

function startGame() {
    requestId = requestAnimationFrame(startCanvas);
    intervalId = setInterval(() => {
        time--;
        if(time <= 0) {
            fondo.win = true
            clearInterval(requestId = undefined)
            // requestAnimationFrame = undefined
        }
    }, 1000)
}

window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        startGame();
    }
}

addEventListener('keydown', (e) => {
    // Left
    if(e.keyCode === 65) {
        defender.direction = 'left';
        defender.x -= 30;
    }
    // Right
    if(e.keyCode === 68) {
        defender.direction = 'right';
        defender.x += 30;
    }
    // Up
    if(e.keyCode === 87) {
        defender.direction = 'up';
        defender.y -= 30;
    }
    // Down
    if(e.keyCode === 83) {
        defender.direction = 'down';
        defender.y += 30;
    }
    // Shot
    if(e.keyCode === 75) {
        if(bullets.length >= 3) {
            console.log('No hay pescados');
        } else {
            const bullet = new Bullet(defender.x, defender.y, defender.direction);
            bullets.push(bullet)
        }
    }
});
