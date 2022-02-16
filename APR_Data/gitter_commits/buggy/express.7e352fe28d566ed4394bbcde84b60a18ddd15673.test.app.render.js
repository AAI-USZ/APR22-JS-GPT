
var express = require('../')
  , assert = require('assert');

describe('app', function(){
  describe('.render(name, fn)', function(){
    describe('when an error occurs', function(){
      it('should invoke the callback', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');

        app.render('user.jade', function(err, str){
          // nextTick to prevent cyclic
          process.nextTick(function(){
            err.message.should.match(/user is not defined/);
            done();
          });
        })
      })
    })

    describe('when an extension is given', function(){
      it('should render the template', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');

        app.render('email.jade', function(err, str){
          assert(null == err);
          str.should.equal('<p>This is an email</p>');
          done();
        })
      })
    })

    describe('when "view engine" is given', function(){
      it('should render the template', function(done){
        var app = express();

        app.set('view engine', 'jade');
        app.set('views', __dirname + '/fixtures');

        app.render('email', function(err, str){
          assert(null == err);
          str.should.equal('<p>This is an email</p>');
          done();
        })
      })
    })
  })
  
  describe('.render(name, options, fn)', function(){
    it('should render the template', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');

      var user = { name: 'tobi' };

      app.render('user.jade', { user: user }, function(err, str){
        assert(null == err);
        str.should.equal('<p>tobi</p>');
        done();
      })
    })
  })
})
