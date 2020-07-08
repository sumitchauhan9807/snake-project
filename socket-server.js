const io = global.io;
 const currentGames = {};
 const clientsObject = {}
class Socket{
    constructor(){
        this.allClients = [];
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
            clientsObject[roomName] = [];
            clientsObject[roomName].push(client);
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
                clientsObject[roomname].push(client);
                new Game(client,{
                    client2:data.clientId,
                    client1:data.requestFromClientID,
                    roomname:roomname
                })
        })

        client.on('gameData',(gameData)=>{
           // console.log(gameData)
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

class Game{
    constructor(client,gameData){
        console.log('A NEW GAME HAS STARTED DUDE !!S')
        this.updateCurrentGames(gameData)
        this.palceMouse(gameData.roomname);
        this.setGameEventsServer(client,gameData)
        console.log(currentGames);
    }

    updateCurrentGames(gameData){
        if(!currentGames[gameData.roomname]){
            currentGames[gameData.roomname] = {};
            currentGames[gameData.roomname]["score"] = { [gameData.client1] : 0,[gameData.client2]: 0 }
            currentGames[gameData.roomname]["netScore"] = 0
        }
        if(!currentGames.currentPlayers){
            currentGames.currentPlayers = {};
        }
        currentGames.currentPlayers[gameData.client1] = { oppenent:gameData.client2 }
        currentGames.currentPlayers[gameData.client2] = { oppenent:gameData.client1 }
    }

    palceMouse(roomname){
        io.to(roomname).emit('palceMouse',{
            mouse:generateMouse()
        })
    }

    setGameEventsServer(client,gameData){
        var _this = this;
        clientsObject[gameData.roomname].forEach((thisClient)=>{
            thisClient.on('mouseEaten',()=>{
                var clientId = thisClient.id;
                currentGames[gameData.roomname]["score"][clientId]++;
                currentGames[gameData.roomname]["netScore"]++;
                _this.palceMouse(gameData.roomname);
                io.to(gameData.roomname).emit('updatedScore',currentGames[gameData.roomname])
                console.log('KISI NE MOISE KHA LIYA HAI')
                console.log(currentGames)
            })
        })
        
    }
}
new Socket();
function generateMouse(){
    var noOfBoxes = 1650;
    return  Math.floor(Math.random() * noOfBoxes);
}
