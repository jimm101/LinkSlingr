var should = require('chai').should();

var websocket_host = "ws://localhost:7000";
var WebSocket = require('ws');

var WEBSOCKETS_TO_OPEN = 200; 

describe('LinkSlingd', function () {
  var ws = [];
  describe('websocket', function () {
    it('should connect 2 websockets', function (done) {
      try {
          ws[0] = new WebSocket(websocket_host);
          ws[0].onopen = function() { };
          ws[1] = new WebSocket(websocket_host);
          ws[1].onopen = function() { done(); };
      } catch( error ) {
        console.log(error)
        error.message.should.not.equal("connect ECONNREFUSED");
      }
    });
    var test_url = "http://www.example.com";
    it('should send URL between sockets', function(done) {
      ws[0].onmessage = function(event) {
        event.data.should.equal.test_url;
        done();
      };
      ws[1].send(test_url);
    });
    it('should NOT send \'pong\' between sockets', function(done) {
      ws[0].onmessage = function(event) {
        event.data.should.not.equal('pong');
        done();
      };
      ws[1].send('pong');
      ws[1].send(test_url);
    });
    it('should close 2 websockets', function (done) {
      try {
        ws[0].onclose = function () {};
        ws[1].onclose = function () {};
        ws[0].close();
        ws[1].close();
        delete ws[0];
        delete ws[1];
      } catch(error) {
        should.not.exist(error);
      } finally {
        done();
      }
    });
    it('should open '+WEBSOCKETS_TO_OPEN+' websockets', function(done) {
      try {
        var open_counter = 0; 
        for( var i=0; i<WEBSOCKETS_TO_OPEN; i++ ) {
          ws[i] = new WebSocket(websocket_host);
          ws[i].onopen = function () { 
            open_counter += 1;
            if( open_counter == WEBSOCKETS_TO_OPEN ) {
              done();
            } 
          };
          ws[i].onmessage = function (message) {};
          ws[i].onclose = function (event) {};
        } 
      } catch(error) {
        error.should.not.exist;
      }
    });
  });
});
