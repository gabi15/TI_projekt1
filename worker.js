onmessage = function(e) {
    console.log('Message received from main script');
    let x = e.data[0];
    let y=e.data[1];
    let particles = e.data[2];
    let r = e.data[3];
    let w = e.data[4];
    let h = e.data[5];

    for(let j=0; j<particles.length; j++)
    {
        if(Math.sqrt(Math.pow(x-particles[j].x, 2) + Math.pow(y-particles[j].y, 2))<= 2*particles[j].radius)
        {
            x = Math.random()*(w-2*r)+r;
            y = Math.random()* (h-2*r)+r;

            j=-1;
        }
    }

    postMessage([x,y]);
}
