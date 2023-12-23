// Actual P5.js code goes here
let flock =new Flock();
let key_pressed = {};

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 200; i++) {
        flock.addBoid(new Boid());
    }
    
}

function keyPressed(){
    
    // Adding key interaction
    // If p is pressed, pause the simulation
    // Check if p is in the key_pressed object
    if (!key_pressed.hasOwnProperty('p')) {
        key_pressed.p = true;
    }

    if (key === 'p' && (! key_pressed.hasOwnProperty('p') || key_pressed.p)) {
        noLoop();
        key_pressed.p = false;
    } else  if (key === 'p' && !key_pressed.p) {
        loop();
        key_pressed.p = true;
    }

    // If r is pressed, reset the simulation
    if (key === 'r') {
        flock.clearBoids();

        for (let i = 0; i < 200; i++) {
            flock.addBoid(new Boid());
        }
    }

    // If c is pressed, clear the simulation
    if (key === 'c') {
        flock.clearBoids();
    }

    // If + is pressed, add speed to the simulation
    if (key === '+') {
        flock.boids.forEach(boid => {
            boid.maxforce += 0.05;
        });
    }
    
    // If - is pressed, remove speed from the simulation
    if (key === '-') {
        flock.boids.forEach(boid => {
            boid.maxforce -= 0.05;
        });
    }

    // If 1 is pressed, add a boid to the simulation
    if (key === 'a') {
        flock.addBoid(new Boid());
    }

    // If 2 is pressed, remove a boid from the simulation
    if (key === 'd') {
        flock.boids.pop();
    }
}


function draw() {
    background(51);

    // Run the simulation
    flock.run();

    // Display the FPS
    // and the info such as maxForce
    // and number of boids
    strokeWeight(1);
    fill(255);
    textSize(10);
    text('FPS: ' + floor(frameRate()), 200, 30);
    text('Max Force: ' + (Math.round(flock.boids[0].maxforce * 100) / 100).toFixed(2), 200, 60);
    text('Number of Boids: ' + flock.boids.length, 200, 90);
}
