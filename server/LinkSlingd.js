var clients = [];
var timers = {};

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 7000});
wss.on('connection', function(ws) {
    console.log('connections:'+clients.length);
    clients.push(ws);
    timers[ws] = setInterval(function() { ws.send("ping"); }, 3000);
    ws.on('message', function(message) {
      switch( message ) {
        case 'pong':
          break;
        default:
          clients.forEach( function (client) {
            if( client != this ) {
              client.send(message);
            }
          }.bind(ws));
      }
    });
    ws.on('close', function(code) {
        index = clients.indexOf(ws);
        clients.splice(index,1);
        clearTimeout(timers[this]);
        delete timers[this];
        console.log('closed connection:'+code);
    });
    ws.send('connected');
});
