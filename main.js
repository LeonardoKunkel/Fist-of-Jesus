
const canvas = document.getElementById( "myCanvas" );
const ctx = canvas.getContext( "2d" );

let frames = 0;
let requestId;

const enemies = [];
const imagesEnemiesLeft = 'assets/images/defenderLeft.png';
const imagesEnemiesRight = 'assets/images/defenderRight.png';
let bullets = [];

class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = "assets/images/pub.png"
    }
    draw() {
        ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
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
            this.x < item.x + item.width &&
            this.x + this.width > item.x &&
            this.y < item.y + item.height &&
            this.y + this.height > this.y
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
}

class Defender extends Character {
    constructor( x, y, w, h ) {
        super( x, y, w, h )
        this.image1 = new Image()
        this.image1.src = "assets/images/jesusRight.png"
        this.image2 = new Image()
        this.image2.src = "assets/images/jesusLeft.png"
        this.image = this.image1;
        this.direction = ''
    }
    draw() {
        switch (this.direction) {
            default:
                ctx.drawImage( this.image1, this.x, this.y, this.width, this.height );
                break;
            case 'right':
                ctx.drawImage( this.image1, this.x, this.y, this.width, this.height );
                break;
            case 'left':
                ctx.drawImage( this.image2, this.x, this.y, this.width, this.height );
        }
    }
}

class Attacker extends Character {
    constructor( x, y, w, h, img) {
        super( x, y, w, h, img )
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

const fondo = new Background();
const holy = new HolyGrail( 500, 400, 58, 70 );
const defender = new Defender( 500, 600, 85, 130 );


function generarAttackers() {
    // if (frames % 300 === 0 || frames % 600 === 0 || frames % 1200 === 0) {
        // let imgRend = Math.floor(Math.random() * enemies.length);
        // let xPos = Math.floor(Math.random() * (1 - 1000)) + 1;
        // let yPos = Math.floor(Math.random() * (1 - 800)) + 1;
        // const attackerR = new Attacker(xPos, yPos, 50, 50, imagesEnemiesRight[imgRend])
        // const attackerL = new Attacker(xPos, yPos, 50, 50, imagesEnemiesLeft[imgRend])
        //enemies.push(attackerR)
        //enemies.push(attackerL)
    // }
    // console.log(enemies);
}

function drawAttackers() {
    enemies.forEach((enemy, index) => {
        attackerR.draw()
        attackerL.draw()
    })
}

function startCanvas() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fondo.draw()
    holy.draw()
    defender.draw()
    drawBullets()
    generarAttackers()
    requestAnimationFrame(startCanvas)
    // if(requestId) {
    //     requestId = requestAnimationFrame(startCanvas)
    // }
}

startCanvas()

// function startGame() {
//     requestedId = requestAnimationFrame(startCanvas)
// }
addEventListener('keydown', (e) => {
    // Left
    if(e.keyCode === 65) {
        defender.direction = 'left';
        defender.x -= 20;
    }
    // Right
    if(e.keyCode === 68) {
        defender.direction = 'right';
        defender.x += 20;
    }
    // Up
    if(e.keyCode === 87) {
        defender.direction = 'up';
        defender.y -= 20;
    }
    // Down
    if(e.keyCode === 83) {
        defender.direction = 'down';
        defender.y += 20;
    }
    // Shot
    if(e.keyCode === 75) {
        if(bullets.length >= 7) {
            console.log('No hay pescados');
        } else {
            const bullet = new Bullet(defender.x, defender.y, defender.direction);
            bullets.push(bullet)
        }
    }
});
