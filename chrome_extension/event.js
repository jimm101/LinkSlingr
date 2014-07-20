chrome.storage.sync.get({
    url: 'ws://localhost:7000'
  }, function(items) {
    console.log(items.url)
    if( items.url.indexOf('ws://')!=0 && items.url.indexOf('wss://')!=0 ) { 
      items.url = "ws://"+items.url; 
    }
    if( !items.url.match(':[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]$') ) { 
      items.url += ':7000'; 
    }
    var ws = new WebSocket(items.url);
    
    ws.onopen = function() {
      console.log("websocket opened");
    };
    
    ws.onclose = function(code) {
      console.log("websocket closed:"+code);
    };
    
    ws.onerror = function (event) {
      console.log("ERROR:  " + event.data);
    };
    
    ws.onmessage = function(event) {
      switch( event.data ) {
        case 'ping':
          this.send('pong');
          break;
        case 'connected':
          break;
        default:
          chrome.tabs.create({'url': event.data}, function(tab) {
            console.log(event.data);
          });
      }  
    };
    
    chrome.browserAction.onClicked.addListener(
      function(tab) {
        ws.send(tab.url);
      }
    );
  });
  
