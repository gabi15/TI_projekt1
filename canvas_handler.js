const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
//ctx.fillRect(100,100,100,100);
// for(var i=0; i<3; i++){
//     var x = Math.random();
//     var y = Math.random();
//     ctx.beginPath();
//     ctx.arc(x*300, y*300,30,0, Math.PI*2, false);
//     ctx.strokeStyle = 'blue';
//     ctx.stroke();
// }

class Circle{
    constructor(x,y,dx,dy,r)
    {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;

    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    update()
    {
        if(this.x > innerWidth-this.r || this.x<this.r)
        {
            this.dx=-this.dx;
        }
        if(this.y > innerHeight-this.r || this.y<this.r)
        {
            this.dy=-this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.draw();

    }
}



var circleArray = [];
for(var i=0; i<100;i++)
{
    var r = 30;
    var x = Math.random()*(innerWidth-2*r)+r;
    var y = Math.random()* (innerHeight-2*r)+r;
    var dx = (Math.random()-0.5) * 8;
    var dy = (Math.random()-0.5) * 8;

    circleArray.push(new Particle(x,y,dx,dy,r))
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (var el of circleArray)
    {
        el.update();
    }


}
animate();