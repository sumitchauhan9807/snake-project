class Snake{
    // dir  right = 1 , down = 50 
    constructor(snake,board,boardData){
        this.noOfBoxes = boardData.noOfBoxes
        this.boxesOnX = boardData.boxesOnX;
        this.board = board;
        this.snake = snake.snake;
        this.snakeColor = snake.color;
        this.renderSnake()
        this.direction = -50
        setInterval(() => {
            this.moveSnake()    
           // console.log(window.game,"game data")
            socket.emit('gameData',{
                game:window.game,
                myId:socket.id,
                snake:this.snake
            })
        //    console.log(window.mousePos,"mousePos")
        }, 1000/8);
        this.setControls()
    }
    setRulezz(){
        var snakeHead = this.snake[this.snake.length-1];
        if(snakeHead == window.mousePos){
            console.log(this.snake)
            console.log(this.snake[this.snake.length-1],"this.snake[this.snake.length-1]")
          //  alert('mouse')
          document.getElementById("snakehit").play().then(()=>{
              console.log('palyed')
          });
          
             this.snake.push(this.snake[this.snake.length-1] + this.direction)
            
        }
        this.checkCollision()
        
    }
        checkCollision(){
            var snakeArr = [...this.snake];
            let snakeHead = this.snake[this.snake.length-1];

            snakeArr.pop();
            if(snakeArr.includes(snakeHead)){
                document.getElementById("snakedead").play()
                alert('game over')
                location.reload()
            }
          
        }
    
    moveSnake(){
        this.setRulezz();
      if(this.direction == 1){
            var snakeHead = this.snake[this.snake.length-1];
           
            if(snakeHead%this.boxesOnX == 0){
                snakeHead = snakeHead - this.boxesOnX
                console.log(this.boxesOnX)
            }
            snakeHead++;
          this.snake.push(snakeHead)
            $(".box:nth-child("+this.snake[0]+")").removeClass("snake_body")
            this.snake.shift();
            this.renderSnake()
        }
        if(this.direction == -1){
            var snakeHead = this.snake[this.snake.length-1];
           
            if((snakeHead-1)%this.boxesOnX == 0){
                snakeHead = snakeHead + this.boxesOnX
            }
            snakeHead--;
            console.log(snakeHead)
            this.snake.push(snakeHead)
            $(".box:nth-child("+this.snake[0]+")").removeClass("snake_body")
            this.snake.shift();
            this.renderSnake()
        }
        if(this.direction == this.boxesOnX){
            var snakeHead = this.snake[this.snake.length-1];
            snakeHead = snakeHead + this.boxesOnX;
            if(snakeHead > this.noOfBoxes){
               snakeHead = snakeHead - this.noOfBoxes
            }
            this.snake.push(snakeHead)
            $(".box:nth-child("+this.snake[0]+")").removeClass("snake_body")
            this.snake.shift();
            this.renderSnake()
        }
        if(this.direction == -this.boxesOnX){
            var snakeHead = this.snake[this.snake.length-1];
            snakeHead = snakeHead - this.boxesOnX;
            if(snakeHead < 0){
                snakeHead = snakeHead + this.noOfBoxes
            }
            this.snake.push(snakeHead)
            $(".box:nth-child("+this.snake[0]+")").removeClass("snake_body")
            this.snake.shift();
            this.renderSnake()
        }
    }

    renderSnake(){
        this.snake.forEach((k)=>{
            $(".box:nth-child("+k+")").addClass("snake_body")
            //.css('background',this.snakeColor)
            //console.log(this.snake)
        })
    }

    setControls(){
        var _this = this;
        $(document).on("keyup",function(e){
            console.log(e.code,'keyup')
            if(e.code == 'ArrowDown'){
                _this.direction = _this.boxesOnX
            }
            if(e.code == 'ArrowUp'){
                _this.direction = -_this.boxesOnX
            }
            if(e.code == 'ArrowRight'){
                _this.direction = 1
            }
            if(e.code == 'ArrowLeft'){
                _this.direction = -1
            }
        })
    }


}





class SnakeBoard{
    constructor(snake){
        this.boardData = {};
        this.noOfBoxes = 1650
        this.addBoxes(snake)
        this.calc();
        this.placeMouse();
    }

    addBoxes(snake){
        for(var i=0;i<this.noOfBoxes;i++){
            snake.append('<div num='+i+' class="box"></div>')
        }
    }
    placeMouse(){
        let mouseBox = Math.floor(Math.random() * this.noOfBoxes);
            console.log(mouseBox);
            window.mousePos = mouseBox;
            $(".box").removeClass('mouse')
            $(".box:nth-child("+mouseBox+")").addClass("mouse")
        // setInterval(()=>{
        //     let mouseBox = Math.floor(Math.random() * this.noOfBoxes);
        //     console.log(mouseBox);
        //     window.mousePos = mouseBox;
        //     $(".box").removeClass('mouse')
        //     $(".box:nth-child("+mouseBox+")").addClass("mouse")
        // },10000)  
    }

    calc(){
        let boardWidth = $(".snake").width();
        let boxWidth = (2/100) * boardWidth;
        let boxesOnX = boardWidth/boxWidth
        let boardheight = $(".snake").height();
        let boxHeight = 16 ;
        let boxesOnY = boardheight/boxHeight;
        this.boardData = {
            boxesOnX:Math.floor(boxesOnX),
            boxesOnY:Math.floor(boxesOnY),
            noOfBoxes:this.noOfBoxes
        }

    }

    
}