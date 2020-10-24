const tutorial_canvas = document.getElementById("tutorial");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
tutorial_canvas.style.background = "black"
    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            const xdif = this.x1-this.x2
            const ydif = this.y1-this.y2
            const hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }
    class Blade{
        constructor(dis, angle, size, king){
            this.king = king
            this.dis = dis
            this.angle = angle
            this.spin = (Math.random()-.5)*.1
            this.body = new Bosscircle(this.king.body.x,this.king.body.y,size, "gray")
            this.body.x = this.king.body.x + (Math.cos(this.king.angle+this.angle)*this.dis)
            this.body.y = this.king.body.y + (Math.sin(this.king.angle+this.angle)*this.dis)
        }
        draw(){
            this.body.color = this.king.color
            this.angle+=this.spin
            this.body.x = this.king.body.x + (Math.cos(this.king.angle+this.angle)*this.dis)
            this.body.y = this.king.body.y + (Math.sin(this.king.angle+this.angle)*this.dis)
            this.body.draw()
        }

    }
    class Sawoid{
        constructor(x = Math.random()*tutorial_canvas.width,y = tutorial_canvas.height*Math.random(),r = 5, s = 1, saws = []){
            this.marked = 0
            this.saws = saws
            this.s = s
            this.r = Math.random()*255
            this.g = Math.random()*255
            this.b = Math.random()*255
            this.turns = 0
            this.angle = 0
            this.body = new Bosscircle(x,y,r,  `rgba(${this.r},${this.g},${this.b}, 1)`, Math.random()-.5, Math.random()-.5)
       
            for(let t = this.saws.length;t<this.s; t++){
                this.saws.push(new Blade((this.body.radius*1.5)+Math.random()*25, Math.random()*Math.PI*2, Math.random()+1, this))
            }
            

        }
        draw(){
            this.body.color = `rgba(${this.r},${this.g},${this.b}, 1)`
            this.turns 
            this.body.draw()
            for(let t=0;t<this.saws.length;t++){
                this.saws[t].draw()
            }
            this.body.move()
        }
        clonesaws(target){
            target.saws = []
            for(let t=0;t<this.saws.length;t++){
                let sizer = this.saws[t].body.radius+((Math.random()-.5)*.1)
                target.saws.push(new Blade(Math.max(sizer, this.saws[t].dis+(Math.random()-.5)), this.saws[t].angle+(Math.random()-.5), sizer, target))
                target.saws[t].spin = this.saws[t].spin
            }



        }
        reproduce(){
            if(this.marked == 2){
                this.marked = 0
                let sawyer = new Sawoid(this.body.x,this.body.y,this.body.radius+(Math.random()-.5), this.saws.length+((Math.random()-.5)*1.0))
                sawyer.r = this.r+((Math.random()-.5)*10)
                sawyer.g = this.g+((Math.random()-.5)*10)
                sawyer.b = this.b+((Math.random()-.5)*10)
                if(sawyer.r > 255){
                    sawyer.r = 255
                }  
                if(sawyer.r < 0){
                    sawyer.r = 0
                }
                if(sawyer.g > 255){
                    sawyer.g = 255
                }  
                if(sawyer.g < 0){
                    sawyer.g = 0
                }
                if(sawyer.b > 255){
                    sawyer.b = 255
                }  
                if(sawyer.b < 0){
                    sawyer.b = 0
                }
                
                sawyer.body.color = this.body.color
                this.clonesaws(sawyer)
    saws.push(sawyer)
            }
        }
        clean(){
            if(this.marked == 1){
                saws.splice(saws.indexOf(this),1)
            }
        }
        colorDistance(target){
            let rk = (this.r-target.r)*(this.r-target.r)
            let gk = (this.g-target.g)*(this.g-target.g)
            let bk = (this.b-target.b)*(this.b-target.b)

            return Math.sqrt(rk+bk+gk)

        }
    }
    class Bosscircle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){   
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.lineWidth = 0
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            if(this.radius < 1){
                this.radius = 1
            }
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
            if(this.x > tutorial_canvas.width){
                this.x = tutorial_canvas.width
                if(this.xmom > 0){
                    this.xmom *=-1
                }
            }
            if(this.y > tutorial_canvas.height){
                this.y = tutorial_canvas.height
                if(this.ymom > 0){
                    this.ymom *=-1
                }
            }
            if(this.x < 0){
                this.x = 0
                if(this.xmom < 0){
                    this.xmom *=-1
                }
            }
            if(this.y < 0){
                this.y = 0
                if(this.ymom < 0){
                    this.ymom *=-1
                }
            }
        }
        isPointInside(point){
            let link = new Line(this.x,this.y, point.x,point.y, "red", 1)
            if(link.hypotenuse()<= this.radius){
                return true
            }
            return false
        }
        repelCheck(point){
            let link = new Line(this.x,this.y, point.x,point.y, "red", 1)
            if(link.hypotenuse()<= this.radius+point.radius){
                return true
            }
            return false
        }
    }

let saws = []

for(let t = 0; t<390;t++){
    let sawyer = new Sawoid(Math.random()*tutorial_canvas.width,tutorial_canvas.height*Math.random(),10,1)
    saws.push(sawyer)

}
window.setInterval(function(){ 
    tutorial_canvas_context.clearRect(0,0,700,700)
  
    for(let t = 0;t<saws.length;t++){
        saws[t].draw()
        for(let k = 0;k<saws.length;k++){
            for(let h = 0;h<saws[k].saws.length;h++){
                if(t!=k){
                    if(saws[t].colorDistance(saws[k]) > 20){
                        if(saws[t].body.repelCheck(saws[k].saws[h].body)){
                            saws[t].marked = 1 
                            if(saws[k].marked == 0){
                                saws[k].marked = 2
                            }
                        }
                    }
                }
            }
        }
    }


    for(let t = 0;t<saws.length;t++){
        saws[t].clean()
    }
    for(let t = 0;t<saws.length;t++){
        saws[t].reproduce()
    }
},  10) 


function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
    }
    