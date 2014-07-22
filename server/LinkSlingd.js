var clients = [];
var timers = {};
var connection_count = 0;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 7000});
wss.on('connection', function(ws) {
    connection_count += 1;
    console.log('connections:'+connection_count);
    ws.id = Math.random() * 0x400000000;
    clients[ws.id] = ws;
    timers[ws.id] = setInterval(function() {
      if( ws.readyState == 1 ) { /* web socket open */
        ws.send("ping");
      } else {
        console.log('skipping');
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
        console.log('closed connection:'+connection_count);
    });
    ws.send('connected');
});
