export function showTouchdownMessage() {
    console.log("Running touchdown animation...");
  
    const message = document.getElementById("touchdown-message");
    if (!message) {
      console.error("Error: 'touchdown-message' element not found in the DOM.");
      return;
    }
  
    // Show the message container
    message.classList.remove("hidden");
  
    // Apply animation to each letter with a staggered delay
    const letters = message.querySelectorAll("span");
    letters.forEach((letter, index) => {
      letter.style.animationDelay = `${index * 0.1}s`; // Stagger each letter by 0.1s
    });
  
    // Hide the message after the animation ends
    setTimeout(() => {
      message.classList.add("hidden");
    }, 2000); // Adjust duration as needed
  }




  export class Fireworks {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  
      this.fireworks = [];
      this.animationFrame = null;
  
      // Adjust canvas size dynamically
      window.addEventListener("resize", () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      });
    }
  
    // Start the animation
    start() {
      this.animationFrame = requestAnimationFrame(() => this.animate());
      // Launch new fireworks periodically
      this.launchInterval = setInterval(() => this.createFirework(), 500);
    }
  
    // Stop the animation
    stop() {
      cancelAnimationFrame(this.animationFrame);
      clearInterval(this.launchInterval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.fireworks = [];
    }
  
    // Create a new firework
    createFirework() {
      const x = Math.random() * this.canvas.width;
      const y = this.canvas.height;
      this.fireworks.push(new Firework(x, y, this.ctx));
    }
  
    // Main animation loop
    animate() {
        // Remove the background clearing if the canvas should be transparent
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the previous frame
      
        // Update and draw each firework
        this.fireworks.forEach((firework, index) => {
          firework.update();
          firework.draw();
          // Remove finished fireworks
          if (firework.exploded && firework.particles.length === 0) {
            this.fireworks.splice(index, 1);
          }
        });
      
        this.animationFrame = requestAnimationFrame(() => this.animate());
      }
  }
  
  class Firework {
    constructor(x, y, ctx) {
      this.x = x;
      this.y = y;
      this.targetY = y - Math.random() * 200 - 100; // Random height
      this.exploded = false;
      this.particles = [];
      this.color = `hsl(${Math.random() * 30 + 100}, 100%, 50%)`; // Green hues
      this.ctx = ctx; // Use context from parent class
    }
  
    update() {
      if (!this.exploded) {
        this.y -= 5; // Firework rises
        if (this.y <= this.targetY) {
          this.exploded = true;
          this.createParticles();
        }
      } else {
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(p => p.alpha > 0); // Remove faded particles
      }
    }
  
    draw() {
      if (!this.exploded) {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
      } else {
        this.particles.forEach(particle => particle.draw());
      }
    }
  
    createParticles() {
      for (let i = 0; i < 50; i++) {
        this.particles.push(new Particle(this.x, this.y, this.color, this.ctx));
      }
    }
  }
  
  class Particle {
    constructor(x, y, color, ctx) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 3 + 1;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.ctx = ctx; // Use context from parent class
    }
  
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.decay; // Fade out
    }
  
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`; // Green color with alpha
      this.ctx.fill();
    }
  }