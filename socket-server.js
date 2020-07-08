const io = global.io;

class Socket{

    

    constructor(){
        this.allClients=[];
        io.on('connection', client => {
            console.log('a client i connectred');
            client.join(client.id);
            this.setHandlers(client);
        });
    }

    setHandlers(client){
        
        client.on("clientData",(data)=>{
            data.id = client.id
            this.allClients.push(data);
            io.emit('allClients',this.allClients)
        })

        client.on('disconnect', (data)=>{
            this.allClients = this.allClients.filter((thisClient)=>{
                    return thisClient.id != client.id
            })
            io.emit('allClients',this.allClients)
        });

        client.on('requestMatch',(data)=>{
            var roomName = data.clientId+data.requestClientID;
            client.join(roomName)
            io.to(data.requestClientID).emit('matchRequest',{
                requestId:data.clientId
            })
            console.log(data,'a request for match i srthere')
        })

        client.on('confirmMatch',(data)=>{
                var roomname = data.requestFromClientID+data.clientId;
                client.join(roomname)
                io.to(roomname).emit('startMatch',{
                    client2:data.clientId,
                    client1:data.requestFromClientID,
                    roomname:roomname
                })
        })

        client.on('gameData',(gameData)=>{
            console.log(gameData)
            var toEmitId = Object.values(gameData.game.gameData).find((x)=>{
                return x != gameData.myId
            })
           // console.log(gameData,"toEmitId")
            io.to(toEmitId).emit('snakeArray',{
                snake:gameData.snake
            })
          
        })
    }









}

new Socket();

