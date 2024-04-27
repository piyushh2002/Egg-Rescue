window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2D');
    canvas.width =1280;
    canvas.height= 720;


    ctx.fillstyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = '40px Helvetica';
    ctx.textAlign = 'center';
    
    //PLAYER 

    class player{
        constructor(Game){ 
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height* 0.5;
            this.collisionRadius = 30;
            this.speedX = 0
            this.speedY = 0
            this.dx = 0;
            this.dy = 0;
            this.speedmodifier = 3;
            this.spriteWidth = 255;
            this.spriteHeight = 255;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX ;
            this.spriteY; 
             this.FrameX = 0;
             this.FrameY = 5;
            this.image = document.getElementById('bull');
 
        }

         restart(){
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height* 0.5;
            this.spriteX = this.collisionX - this.width *0.5;
            this.spriteY= this.collisionY - this.height *0.5 -100;
         }

    draw(context){
        context.drawImage(this.image,this.FrameX *  this.spriteWidth,this.FrameY * this.spriteHeight,
           this.spriteHeight, this.spriteX, this.collisionY, this.collisionX, 
            this.collisionY, this.width, this.height);
            if(this.game.debug){
    context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius ,
        0 , Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveto(this.collisionX, this.collisionY);
        context.lineto(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      
            }
        
          }
          update(){
           
             this.dx = this.game.mouse.x - this.collisionX;
             this.dY = this.game.mouse.Y - this.collisionY;

             //Sprite animation
             const angle = Math.atan2(this.dy, this.dx);
             if (angle <  -2.74 || angle > 2.74)this.FrameY = 6;
             else if (angle < -1.96)this.FrameY = 7;
             else if (angle < -1.17)this.FrameY = 0;
             else if (angle < -0.39)this.FrameY = 1;
             else if (angle <  0.39)this.FrameY = 2;
             else if (angle <  1.17)this.FrameY = 3;
             else if (angle <  1.96)this.FrameY = 4;
             else if (angle <  2.74)this.FrameY = 5;
             

             const distance =Math.hypot(this.dy , this.dx);
             if (distance > this.speedmodifier){
                this.speedX = this.dx/distance ||0;
                this.speedY = this.dy/distance  || 0 ;
             } else{
                this.speedX =0;
                this.speedY =0;
             }
            
            this.collisionX += this.speedX * this.speedmodifier;
            this. collisionY = this.speedY * this.speedmodifier;
            this.spriteX = this.collisionX - this.width *0.5;
            this.spriteY= this.collisionY - this.height *0.5 -100;

            //horizontal boundaries 
            if(this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius;
            else if(this.collisionX > this.game.width - this.collisionRadius)
            this.collisionX = this.game.width - this.collisionRadius; 

            //vertical boundaries
            if(this.collisionY <this.game.topMargin +this.collisionRadius)this.collisionY 
             = this.game.topMargin +this.collisionRadius;
             else if(this.collisionY > this.game.height - this.collisionRadius)this.collisionY
             = this.game.height - this.collisionRadius;
            

              // collisions with obstacles
            this.game.obstacle.forEach(obstacle =>{
              //  [(distance < sumOfRadii ), distance. sumOfRadii,dx , dy ]
              [let collision , distance, sumOfRadii, dx, dy] 
              = this.game.CheckCollision(this , obstacle);

              //let collison = game.checkcollision(this, obstacle)[0];
              //let distance = game.checkcollision(this, obstacle)[1];
             if (collision){
                const unit_x =dx /distance;
                const unit_y =dy /distance;
                this.collisionX = obstacle.collisionX + (sumOfRadii + 1)* unit_x;
                this.collisionY = obstacle.collisionY + (sumOfRadii + 1)* unit_y;
              

             }
            });
              

          }
    }

   class obstacle {
        constructor(game){
        this.game = game;
        this.collisionX =Math.random() * this.game.width;
        this.collisionY = Math.random() * this.game.height;
        this.collisionRadius =40;
        this.image = document.getElementById('obstacles');
        this.spriteWidth = 250;
        this.spriteHeight = 250;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.width * 0.5 -70; 
        this.FrameX = Math.floor(Math.random() *4);
        this.FrameY = Math.floor(Math.random() *3);

        }
        draw(context){
            context.drawImage(this.image, this.FrameX * this.spriteWidth,
         this.FrameY* this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY,
            this.width , this.height);
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius ,
                0 , Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();

            }
            
    }
    update(){

    }
}
    class Egg {

     constructor(game){
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;
      this.collisionX = this.margin +  (Math.random() * (this.game.width - this.margin * 2));
      this.collisionY = this.game.topMargin + (math.random() * (this.game.height - this.game.topMargin
       - this.margin));
      this.image = document.getElementById('egg');
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX ;
      this. spriteY;
      this.hatchTimer = 0;
      this.hatchInterval = 3000;
      this.markedForDeletion = false;
     
    }
    draw(context){
        context.drawImage(this.image, this.spriteX, this.spriteY);
        if(this.game.debug){
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius ,
            0 , Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            const displayTimer = (this.hatchTimer * .1) .toFixed(0);
            context.fillText(displayTimer, this.collisionX, This.collisionY - this.collisionRadius * 2);
    }

    }
    update(deltaTime){
        this.spriteX = this.collisionX - this.width * 0.5;
        this. spriteY = this.collisionY - this.height * 0.5 -30 ;

        //collisions
        let collisionObject = [this.game.player, ...this.game.obstacle, ...this.game.enemies, ...this.game.hatchlings];
        collisionObject.forEach(Object =>{
            let [collision ,distance, sumOfRadii ,dx, dy] = this.game.CheckCollision(this, Object);
        if(collision){
            const unit_x = dx/distance;
            const unit_y = dy/distance;
            this.collisionX = Object.collisionX + (sumOfRadii + 1) * unit_x;
            this.collisionY = Object.collisionY + (sumOfRadii + 1) * unit_y;
        }
        });

        //hatching
        if(this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin){
            this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY
            ));
           this.markedForDeletion = true;
           this.game.removeGameObjects();

        }else{
            this.hatchTimer += deltaTime;

        }

    }

}

     class Larva {
        constructor(game, x, y){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 30;
            this.image = document.getElementById('larva');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.speedX;
            this.speedY;
            this.speedY = 1 + math.random();
            this.FrameX = 0;
            this.FrameY = Math.floor(Math.random() * 2);

        }
        draw(context){
            context,drawImage(this.image,this.FrameX * this.spriteWidth, this.FrameY * this.spriteHeight, 
                this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY,
                this.width, this.height );
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius ,
                0 , Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
        }
        }
        update(){
         this.collisionY -=this.speedY;
         this.spriteX = this.collisionX - this.width * 0.5;
         this.spriteY = this.collisionY - this.height * 0.5 -40;

         //move to safety
         if(this,this.collisionY < this.game.topMargin){
            this.markedForDeletion = true;
            this.game.removeGameObjects();
            if(!this.game.gameOver)this.game.score++;
            for(let i=0; i < 3; i++){
                 this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));
            }
           

         }
         //collision with Objects
         let collisionObject = [this.game.player, ...this.game.obstacles];
        collisionObject.forEach(Object =>{
            let [collision ,distance, sumOfRadii ,dx, dy] = this.game.CheckCollision(this, Object);
        if(collision){
            const unit_x = dx/distance;
            const unit_y = dy/distance;
            this.collisionX = Object.collisionX + (sumOfRadii + 1) * unit_x;
            this.collisionY = Object.collisionY + (sumOfRadii + 1) * unit_y;
        }
        });

        //collision with enemies
        this.game.enemies.forEach(enemy =>{
            if (this.game.CheckCollision(this, enemy[0] && !this.game.gameOver)){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                this.game.lostHatchlings++;
                for(let i=0; i < 3; i++){
                 this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'blue'));
            }

            }
        });
 


        }
     }

    class Enemy{
        constructor(game){
            this.game = game;
            this.collisionRadius = 30;
            this.speedX = math.random() * 3 + 5;
            this.image = document.getElementById('toads');
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.collisionX = this.game.width + this.width + math.random() * this.game.width * 0.5;
            this.collisionY = this.game.topMargin + (math.random() * (this.game.height - this.game.topMargin));
            this.spriteX;
            this.spriteY;
            this.FrameX = 0;
            this.FrameY = math.floor(math.random() * 4);
        }
        draw(context){
            context,drawImage(this.image,this.FrameX * this.spriteWidth, this.FrameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                  this,spriteX, this.spriteY, this.width, this.height);
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius ,
                0 , Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
        }
        }
        update(){
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 40;
            this.collisionX -= this.speedX;
            if(this.spriteX + this.width <0 && this.game.gameOver){
                this.collisionX = this.game.width + this.width + math.random() * this.game.width * 0.5;
                this.collisionY = this.game.topMargin + (math.random() * (this.game.height - this.game.topMargin));
                this.FrameY = math.floor(math.random() * 4);
                
            }
            let collisionObject = [this.game.player, ...this.game.obstacle];
            collisionObject.forEach(Object =>{
            let [collision ,distance, sumOfRadii ,dx, dy] = this.game.CheckCollision(this, Object);
            if(collision){
            const unit_x = dx/distance;
            const unit_y = dy/distance;
            this.collisionX = Object.collisionX + (sumOfRadii + 1) * unit_x;
            this.collisionY = Object.collisionY + (sumOfRadii + 1) * unit_y;
        }
        });

        }
    }

    class Particle {
        constructor ( game, x, y, color ){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.color = color;
            this.radius = math.floor(math.random() * 10+5);
            this.speedX = math.random() * 6 - 3;
            this.speedY = math.random() * 2 + 0.5;
            this.angle = 0;
            this.va = math.random() * 0.1 + 0.01;
            this.markedForDeletion = false;

        }
        draw(context){
            context.save();
            context.fillstyle = This.color;
            context.beginPath();
            context.arc(This.collisionX , This.collisionY , this.radius , 0 , math.PI * 2 );
            context.fill();
            context.stroke();
            context.restore();
        
        }

    }

    class Firefly extends Particle {
        update(){
            this.angle +=this.va;
            this.collisionX += Math.cos(this.angle) * this.speedX;
            this.collisionY -= this.speedY;
            if (this.collisionY < 0 - This.radius){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
        }

    }

    class Spark extends Particle {
        update(){
            this.angle += This.va * 0.5;
            this.collisionX -=Math.sin(this.angle) * this.speedX;
            this.collisionY -= Math.cos(this.angle) * this.speedY;
            if(this.radius > 0.1) this.radius -= 0.05;
            if (this.radius < 0.2){
                This.markedForDeletion = true;
                this.game.removeGameObjects();
            }

        }

    }

    class Game {
        
        constructor (canvas){
            this.canvas =canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 260;
            this.debug = true;
            this.player = new player(this);
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.eggTimer = 0;
            this.eggInterval = 500;
            this.numberOfObstacles = 10;
            this.maxEggs = 20; 
            this.obstacle =[];
            this.eggs =[];
            this.enemies =[];
            this.hatchlings =[];
            this.particles =[];
            this.gameObjects= [];
            This.score = 0;
            this.winningScore = 30;
            this.gameOver = false;
            this.lostHatchlings = 0;
            this.mouse ={
                x: this.width * 0.5,
                y: this.height *0.5,
                pressed: false
            }

            //event listeners
            canvas.addEventListener('mousedown', (e)=> {
                this.mouse.x =e.offsetX;
                this.mouse.y =e.offsetY;
                this.mouse.pressed= true ;

            });

            canvas.addEventListener('mouseup', (e)=> {
                this.mouse.x =e.offsetX;
                this.mouse.y =e.offsetY;
                this.mouse.pressed= true ;

            });

            canvas.addEventListener('mousemove', (e)=> {
                if (this.mouse.pressed){
                this.mouse.x =e.offsetX;
                this.mouse.y =e.offsetY;
                this.mouse.pressed= true ;
                }
            });
            window.addEventListener('keydown',e=> {
                if (e.key == 'd')this.debug = !this.debug;
                else if (e.key == 'r')this.restart();
            });

        }
         render(context , deltaTime){
            if(this.timer > this.interval){
                context.clearRect(0,0, this.width , this.height);
                this.gameObjects = [...this.player, ...this.eggs , ...this.obstacles, ...this.enemies, ...this.hatchlings, ...this.Particles];

                //sort by vertical position
                this.gameObjects.sort((a,b) =>{
                return a.collisionY - collisionX;
               });
                this.gameObjects.forEach(Object =>
                    Object.draw(context));
                    Object.update(deltaTime);
                    this.timer = 0;
            };

            this.timer +=deltaTime;
           
            // add eggs periodically
            if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver){
                this.addEgg();
                this.eggTimer = 0;
            } else{
                this.eggTimer +=  deltaTime;
            }
             
            // draw status text
            context.save();
            context.textAlign ='left';
            context.fillText('score :' + this.score , 25, 50);
            if(this.debug){
                context.fillText('Lost :' + this.lostHatchlings , 25, 100);
            }
            context.restore();

           //win / loss message
           if(this.score >= this.winningScore){
            this.gameOver = true;
            context.save();
            context.fillstyle = 'rgba(0,0,0,0.5)';
            context.fillRect(0,0, this.width, this.height );
            context.fillstyle ='white';
            context.textAlign = 'center';
            context.shadowOffsetX = 4;
            context.shadowOffsetY = 4;
            context.shadowColor = 'black';
            let message1;
            let message2;
            if(this.lostHatchlings <= 5){
                message1 ="You Won!!!";
                message2 ="YOu bullied the enemies!!!";
            }else {
                message1 ="Well Try";
                message2 ="Better luck next time" + this.lostHatchlings ;
            }
           
           }
           context.font ='130px Helvetica';
           context.fillText (message1, this.width * 0.5, this.height * 0.5 - 20);
           context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
           context.fillstyle("Final score" + this.score + ". Press 'R' to restart", 
           this.width * 0.5, this.height * 0.5 + 80);
           context.restore();
         }
         CheckCollision(a,b){
            const dx = a.collisionX - b.collisionX;
            const dY = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            return [(distance < sumOfRadii ), distance. sumOfRadii,dx , dy ];
         }

           addEgg(){
            this.eggs.push(new Egg(this));
           }
           addEnemy(){
            this.enemies.push(new Enemy(this));
           }

           removeGameObjects(){
            this.eggs = this.eggs.filter(Object => !Object.markedForDeletion);
            this.hatchlings = this.hatchlings.filter(Object => !Object.markedForDeletion);
            this.particles = this.particles.filter(Object => !Object.markedForDeletion);
           }

           restart(){
            this.player.restart();
            this.obstacle =[];
            this.eggs =[];
            this.enemies =[];
            this.hatchlings =[];
            this.particles =[];
            this.mouse ={
                x: this.width * 0.5,
                y: this.height *0.5,
                pressed: false
            }
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.init();
           }

         init(){
            for (let i=0; i<5; i++){
                this.addEnemy();
            }
            let attempts =0;
            while(this.obstacle.length < this. numberOfObstacles
             && attempts < 500){
                let testOfObstacle = new obstacle(this);
                let overlap = false;
                this.obstacle.forEach(obstacle => {
                const dx =testOfObstacle.collisionX - obstacle.collisionX;
                const dY =testOfObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dy, dx);
                const distanceBuffer = 150;
                const sumOfRadii = testOfObstacle.collisionRadius + obstacle.collisionRadius
                + distanceBuffer;
                if(distance <sumOfRadii){
                 overlap = true;
                }
                });
                const margin = testOfObstacle.collisionRadius * 3;
                if (!overlap && testOfObstacle.spriteX > 0 && testOfObstacle.spriteX < this.width -
                    testOfObstacle.width && testOfObstacle.collisionY > 260
                && testOfObstacle.collisionY < this.height - margin){
                    this.obstacle.push(testOfObstacle);
                }
                attempts++

            }
         }
    }



    const Game = new Game(canvas);
    game.init();
     console.log(game)
     let lastTime =0;    
    function animate(timestamp){
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        game.render(ctx , deltaTime);
        requestAnimationFrame(animate);

    }
    animate(0);
});
