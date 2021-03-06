var restart_timer;

chrome.storage.sync.get({
    url: 'ws://localhost:14014'
  }, function(items) {
    if( items.url.indexOf('ws://')!=0 && items.url.indexOf('wss://')!=0 ) { 
      items.url = "ws://"+items.url; 
    }
    if( !items.url.match(':[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]$') ) { 
      items.url += ':14014'; 
    }
    var ws = new WebSocket(items.url);
    
    ws.onopen = function() {
      console.log("websocket opened");
      clearInterval(restart_timer);
    };
    
    ws.onclose = function(event) {
      console.log("websocket closed:"+event.code);
      restart_timer = setInterval(function () {
        chrome.extension.getBackgroundPage().window.location.reload();  
      }, 3000);      
    };
    
    ws.onerror = function () {
      console.log("ERROR:  Websocket error.");
    };
    
    ws.onmessage = function(event) {
      switch( event.data ) {
        case 'ping':
          this.send('pong');
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
  
