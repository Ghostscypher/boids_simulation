// Actual P5.js code goes here
let flock =new Flock();

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 200; i++) {
        flock.addBoid(new Boid());
    }
    
}

function draw() {
    background(51);
    flock.run();
}
