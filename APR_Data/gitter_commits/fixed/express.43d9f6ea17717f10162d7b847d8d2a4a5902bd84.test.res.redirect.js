
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.redirect(url)', function(){
    it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.statusCode.should.equal(302);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
    
    describe('when relative', function(){
      it('should construct an absolute url', function(done){
        var app = express();

        app.use(function(req, res){
          res.redirect('/login');
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/login');
          done();
        })
      })
    })
    
    describe('when mounted', function(){
      it('should respect the mount-point', function(done){
        var app = express()
          , admin = express();

        app.set('root', '/admin')

        admin.use(function(req, res){
          res.redirect('/admin/login');
        });

        app.use('/blog', admin);

        request(app)
        .get('/blog')
        .set('Host', 'example.com')
        .end(function(res){
          res.headers.should.have.property('location', 'http://example.com/blog/admin/login');
          done();
        })
      })
    })
  })

  describe('.redirect(status, url)', function(){
    it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(303, 'http://google.com');
      });

      request(app)
      .get('/')
      .end(function(res){
        res.statusCode.should.equal(303);
        res.headers.should.have.property('location', 'http://google.com');
        done();
      })
    })
  })
  
  describe('when the request method is HEAD', function(){
    it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .head('/')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('');
        done();
      })
    })
  })
  
  describe('when accepting html', function(){
    it('should respond with html', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>');
        done();
      })
    })
  })
  
  describe('when accepting text', function(){
    it('should respond with text', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain')
      .end(function(res){
        res.headers.should.have.property('location', 'http://google.com');
        res.body.should.equal('Moved Temporarily. Redirecting to http://google.com');
        done();
      })
    })
  })
})
