
const canvas = document.getElementById( "myCanvas" );
const ctx = canvas.getContext( "2d" );

let frames = 0;
let requestId;

const enemies = [];
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
        // this.image = new Image()
        // this.image.src = ""
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
        this.image = new Image()
        this.image.src = "assets/images/defenderRight.png"
    }
    draw() {
        ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
    }
}

class Attacker extends Character {
    constructor( x, y, w, h, img) {
        super( x, y, w, h, img )
    }
}

class Bullet {
    constructor() {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.image = new Image();
        this.image.src = "assets/images/fishRight.png"
    }
    draw() {
        if( frames % 10 === 0 ) {
            this.x ++;
        }
        ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
    }
}


const fondo = new Background();
const holy = new HolyGrail( 500, 400, 58, 70 );
const defender = new Defender( 500, 600, 80, 80 );

function startCanvas() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fondo.draw()
    holy.draw()
    defender.draw()
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
    if(e.keyCode === 37) {
        defender.x -= 20;
    }
    // Right
    if(e.keyCode === 39) {
        defender.x += 20;
    }
    // Up
    if(e.keyCode === 38) {
        defender.y -= 20;
    }
    // Down
    if(e.keyCode === 40) {
        defender.y += 20;
    }
})
