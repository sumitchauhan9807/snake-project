const socket = io('http://localhost:3000');


class Game{
    constructor(gameData){
        this.gameData = gameData;
        const snakeBoard =  new SnakeBoard($(".snake"));
        const snake1 = new Snake(
            {snake:[200,202,203,204,205],color:'red'},
            $(".snake"),
            snakeBoard.boardData
        );
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
        var person = prompt("Please enter your name", "Harry Potter");
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
            console.log(data)
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
            <div class="card col-md-2" id="${thisClient.id}">
                <img class="card-img-top" src="img_avatar1.png" alt="Card image" style="width:100%">
                <div class="card-body">
                <h4 class="card-title">${thisClient.name}</h4>
                <p class="card-text"></p>
                <div class="matchButtons">
                <a href="#" client-id="${thisClient.id}" class="btn btn-primary setMatch">set match</a>
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
            socket.emit('requestMatch', {
                clientId:socket.id,
                requestClientID:requestClientID
            });
        })
        $(document).on('click',".joinMatch",function(e){
            e.preventDefault();
             var requestFromClientID = $(this).attr('client-id');
            socket.emit('confirmMatch', {
                clientId:socket.id,
                requestFromClientID:requestFromClientID
            });
        })
    }


}


new Socket()

