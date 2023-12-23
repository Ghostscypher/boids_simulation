class Boid {
    constructor() {
        this.position = createVector(windowWidth / 2, windowHeight / 2);
        this.velocity = createVector();
        this.acceleration = createVector();

        this.r = 4.0;
        this.maxforce = 0.05;

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));

        this.position.x = random(width);
        this.position.y = random(height);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(boids) {
        let sep = this.separate(boids);
        let ali = this.align(boids);
        let coh = this.cohesion(boids);

        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(4);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the position to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(4);

        // Steering = Desired minus Velocity
        return p5.Vector
            .sub(desired, this.velocity)
            .limit(this.maxforce);
    }

    separate(boids) {
        let desiredSeparation = 25.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        boids.forEach((other) => {
            let d = p5.Vector.dist(this.position, other.position);
            
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if (d > 0 && d < desiredSeparation) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        });
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(4);
            steer.sub(this.velocity);
            steer.limit(1);
        }

        return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
        let neighborDist = 50;
        let sum = createVector(0, 0);
        let count = 0;

        boids.forEach((other) => {
            let d = p5.Vector.dist(this.position, other.position);

            if (d > 0 && d < neighborDist) {
                sum.add(other.velocity);
                count++;
            }
        });

        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(4);

            // Steering = Desired - Velocity
            return p5.Vector
                .sub(sum, this.velocity)
                .limit(this.maxforce);
        }

        return createVector(0, 0);
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids) {
        let neighborDist = 50;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;

        boids.forEach((other) => {
            let d = p5.Vector.dist(this.position, other.position);

            if (d > 0 && d < neighborDist) {
                sum.add(other.position); // Add location
                count++;
            }
        });

        if (count > 0) {
            sum.div(count);

            return this.seek(sum); // Steer towards the location
        } 
        
        return createVector(0, 0);
    }

    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    show() {
        strokeWeight(5);
        stroke(255);
        point(this.position.x, this.position.y);
    }

    run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.show();
    }
}
