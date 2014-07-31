var should = require('chai').should();
var WebSocket = require('ws');
var config = require('./config.json');

var websocket_host = config.websocket.protocol + ":" 
                   + config.websocket.hostname + ":" 
                   + config.websocket.port;
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
    it('should open '+config.test.max_open_sockets+' websockets', function(done) {
      this.timeout(5000);
      try {
        var open_counter = 0;
        for( var i=0; i<config.test.max_open_sockets; i++ ) {
          ws[i] = new WebSocket(websocket_host);
          ws[i].onopen = function () { 
            open_counter += 1;
            if( open_counter == config.test.max_open_sockets ) {
              done();
            } 
          };
        }
      } catch(error) {
        console.log("ERROR:"+error);
        error.should.not.exist;
      }
    });
  });
});
