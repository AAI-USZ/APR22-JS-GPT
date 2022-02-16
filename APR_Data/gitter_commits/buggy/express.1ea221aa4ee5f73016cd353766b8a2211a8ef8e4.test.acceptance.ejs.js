
var request = require('../support/http')
  , app = require('../../examples/ejs');

describe('ejs', function(){
  describe('GET /', function(){
    it('should respond with html', function(done){
      request(app)
      .get('/')
      .end(function(res){
        res.should.have.status(200);
        res.should.have.header('Content-Type', 'text/html; charset=utf-8');
        res.body.should.include.string('<li>tobi tobi@learnboost.com</li>');
        res.body.should.include.string('<li>loki loki@learnboost.com</li>');
        res.body.should.include.string('<li>jane jane@learnboost.com</li>');
        done();
      });
    })
  })
})