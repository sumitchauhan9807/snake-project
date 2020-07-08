const express = require('express');
const app = express();
const path = require('path');
app.use('/assets',express.static('assets'))



app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})

const server = app.listen(3000)

global.io = require('socket.io')(server);
require('./socket-server');