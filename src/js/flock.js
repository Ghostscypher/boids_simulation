class Flock {

    constructor() {
        this.boids = [];
    }
    
    run() {
        this.boids.forEach(boid => {
            boid.run(this.boids);
        });
    }
    
    addBoid(b) {
        this.boids.push(b);
    }

}