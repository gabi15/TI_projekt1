function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}


//rotation of axes
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}


//changes particles velocities as if the alastic collision occured
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in let for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity after rotation of axes
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);
    
    //Velocity after 1d collision equation
    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

    // Final velocity after rotating axes back to original location
    particle.velocity = rotate(v1, -angle);
    otherParticle.velocity = rotate(v2, -angle);
  }
}

  
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let w =  canvas.width;
let h = canvas.height;

let colors = document.getElementById("colors");

//changing all particels colors 
function colorChange(particles) {
  for (const particle of particles)
  {
    particle.color = colors.value;
    particle.draw();
  }
}

colors.addEventListener('change', function(){
  colorChange(particles);
});

let button_add = document.getElementById("button_add");
let added_mass = document.getElementById("mass");
let added_vx = document.getElementById("vx");
let added_vy = document.getElementById("vy");
let added_color = document.getElementById("add_color");
let has_added = document.getElementById("has_added");


function addParticle(particles)
{
  has_added.style.border = "2px solid black";
  has_added.style.textAlign="center";

  if(added_mass.checkValidity() && added_vx.checkValidity() && added_vy.checkValidity() && added_mass.value.length!=0 && added_vx.value.length!=0 && added_vy.value.length!=0)
  {
    let r = 20;
    let x = Math.random()*(w-2*r)+r;
    let y = Math.random()* (h-2*r)+r;
    let vx = parseInt(added_vx.value);
    let vy = parseInt(added_vy.value);
    let mass = parseInt(added_mass.value);
    let color = added_color.value;

    //worker finds free space for new particle
    if (window.Worker) {
      const myWorker = new Worker("worker.js");
    
      myWorker.postMessage([x,y,particles,r,w,h]);
      console.log('Message posted to worker');
      
      myWorker.onmessage = function(e) {
        console.log('Message received from worker');
        x = e.data[0];
        y = e.data[1];
        particles.push(new Particle(x,y,r,color, {x:vx,y:vy},mass));
        has_added.innerHTML = "Gratulacje! Dodanie cząsteczki powiodło się!";
        has_added.style.background = "green";
      }
    }
    else {
      console.log('Your browser doesn\'t support web workers.')
    }
  
  }
  else{
    has_added.innerHTML = "Dodanie cząsteczki nie powiodło się!<br>Wypełnij prawidłowo wszystkie pola.";
    has_added.style.background = "red";
    
  }

}

button_add.addEventListener('click',function(){
  addParticle(particles);
})


// Objects
class Particle {
  constructor(x, y, radius, color,velocity = {
    x:(Math.random()-0.5) * 8,
    y:(Math.random()-0.5) * 8
    },
    mass=1) 
    {
    this.x = x;
    this.y = y;
    this.velocity =velocity;
    this.radius = radius;
    this.color = color;
    this.mass = mass;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    for(let i=0;i<particles.length;i++)
    {
      //check if it's not the same particle
      if(this==particles[i])
      {
        continue;
      }
      //checking if two particles collided
      if(distance(this.x, this.y,particles[i].x, particles[i].y)<= this.radius+particles[i].radius)
      {
        resolveCollision(this, particles[i]);
      }
    }
    //checking for collision with walls
    if(this.x > w-this.radius || this.x<this.radius)
    {
        this.velocity.x=-this.velocity.x;
    }
    if(this.y > h-this.radius || this.y<this.radius)
    {
        this.velocity.y=-this.velocity.y;
    }

    //updating velocity
    this.x+=this.velocity.x;
    this.y+=this.velocity.y;

    this.draw()
  }
}

// Implementation
let particles
function init() {
  particles = []

  for (let i = 0; i < 10; i++) {
    let r = 20;
    let x = Math.random()*(w-2*r)+r;
    let y = Math.random()* (h-2*r)+r;
    // if(i!==0)
    // {
    //   for(let j=0; j<particles.length; j++)
    //   {
    //     if(distance(x, y,particles[j].x, particles[j].y)<= r+particles[j].radius)
    //     {
    //       let x = Math.random()*(w-2*r)+r;
    //       let y = Math.random()* (h-2*r)+r;

    //       j=-1;
    //     }
    //   }
    // }
    particles.push(new Particle(x,y,r,'blue'))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(object => {
   object.update(particles)
  })
}

init()
animate()