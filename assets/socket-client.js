const socket = io('http://localhost:3000');
const eventEmitter = new EventEmitter();
var requestClientName = '';
var person='';

class Game{
    constructor(gameData){
        this.gameData = gameData;
        const snakeBoard =  new SnakeBoard($(".snake"));
        const snake1 = new Snake(
            {snake:[200,202,203,204,205],color:'red'},
            $(".snake"),
            snakeBoard.boardData
        );
        this.setUIPlay()
        this.setGameEvents()
    }

    setGameEvents(){
        socket.on('palceMouse',(data)=>{
            console.log(data)
            window.mousePos = data.mouse;
            $(".box").removeClass('mouse')
            $(".box:nth-child("+data.mouse+")").addClass("mouse")
        })

        eventEmitter.on('mouseEaten',()=>{
            console.log('mouse has been eaten dude !!!!!!')
            socket.emit('mouseEaten')
        })

        socket.on('updatedScore',(data)=>{
            var scoreArray=[];
            let opponentSocketId =  Object.keys(data.score).find((id)=>{
                return id != socket.id;
            }) 
            var scoreInfo = Object.keys(data.score).map((socketId)=>{
                if(socketId == socket.id){
                    return { [person] : data.score[socketId] }
                }else{
                    return {[requestClientName] :  data.score[socketId]}
                }
                
            }) 
            console.log(data)
            console.log(scoreInfo,"scoreInfoscoreInfoscoreInfoscoreInfoscoreInfoscoreInfo")
            var updatedScore=''
            $.each(scoreInfo,function(name,score){
                updatedScore += `<li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${Object.keys(score)[0]}
                                        <span class="badge badge-primary badge-pill">${Object.values(score)[0]}</span>
                                </li>`
            })
            console.log(updatedScore)
            $(document).find(".list-group").html(updatedScore)
        })
    }
    setUIPlay(){
        $(".connectedClients").css("display","none")
    }
}

class Socket{
    constructor(){
        socket.on('connect', ()=>{
            this.clientId = socket.id;
            console.log('connected to server',socket.id)
        }); 
        this.setSocketHandlers();
        this.setDOMHandlers()
    }

    setSocketHandlers(){
        person = prompt("Please enter your name", "Harry Potter");
        socket.emit('clientData', {
            name:person,
            // _id:Math.floor(Math.random() * 1000000000000)
        });
        
        socket.on('allClients',(allClients)=>{
            this.updateOnlineClients(allClients)
        })
        socket.on('matchRequest',(matchData)=>{
            this.showRequestAlert(matchData)
        })
        socket.on('startMatch',(matchData)=>{
            console.log(matchData,"matchdata")
            window.game = new Game(matchData);
        })
        socket.on('snakeArray',(data)=>{
          //  console.log(data)
            $('.box').removeClass('foreign_snake')
            data.snake.forEach((i)=>{
                $(".box:nth-child("+i+")").addClass("foreign_snake")
            })
        })
        //matchRequest
    }

    showRequestAlert(matchData){
        $(document).find('.connectedClients').find('#'+matchData.requestId)
        .find('.matchButtons').html(`<a href="#" client-id="${matchData.requestId}" class="btn btn-success joinMatch">join match</a>`)
    }


    updateOnlineClients(allClients){
        var html=''
        allClients.forEach((thisClient)=>{
            html+=`
            <div class="card col-md-2" id="${thisClient.id}" data-name="${thisClient.name}">
                <img class="card-img-top" src="img_avatar1.png" alt="Card image" style="width:100%">
                <div class="card-body">
                <h4 class="card-title">${thisClient.name}</h4>
                <p class="card-text"></p>
                <div class="matchButtons">
                <a href="#" client-id="${thisClient.id}" data-name="${thisClient.name}" class="btn btn-primary setMatch">set match</a>
                </div>
                </div>
            </div>
            `
        })
        $('.connectedClients').html(html)
        console.log(allClients)
    }

    setDOMHandlers(){

        var _this = this;
        // request match handler
        $(document).on('click',".setMatch",function(e){
            e.preventDefault();
            var requestClientID = $(this).attr('client-id');
            if(requestClientID == socket.id){
               // alert('playing with yourself');
            }
            $(this).removeClass("btn-primary").addClass("btn-warning")
            requestClientName = $(this).attr("data-name");
            socket.emit('requestMatch', {
                clientId:socket.id,
                requestClientID:requestClientID
            });
        })
        $(document).on('click',".joinMatch",function(e){
            e.preventDefault();
             requestClientName = $(this).parents(".card").attr("data-name");
             var requestFromClientID = $(this).attr('client-id');
            socket.emit('confirmMatch', {
                clientId:socket.id,
                requestFromClientID:requestFromClientID
            });
        })
    }


}


new Socket()

