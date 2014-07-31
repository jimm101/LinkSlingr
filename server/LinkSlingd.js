var clients = [];
var timers = {};
var connection_count = 0;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 14014});
wss.on('connection', function(ws) {
    connection_count += 1;
    console.log('added connections, '+connection_count+' opened.');
    ws.id = Math.random() * 0x400000000;
    clients[ws.id] = ws;
    timers[ws.id] = setInterval(function() {
      if( ws.readyState == 1 ) { /* web socket open */
        ws.send("ping");
      }
    }, 3000);
    ws.on('message', function(message) {
      switch( message ) {
        case 'pong':
          break;
        default:
          for( var id in clients ) {
            if( clients.hasOwnProperty(id) && clients[id] != this ) {
              clients[id].send(message);
            }
          };
      }
    });
    ws.on('close', function(code) {
        clearTimeout(timers[ws.id]);
        delete timers[ws.id];
        delete clients[ws.id];
        connection_count -= 1;
        console.log('closed connection, '+connection_count+' still opened.');
    });
});
