
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');

describe('res', function(){
  describe('.jsonp(object)', function(){
    it('should respond with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('typeof something === \'function\' && something({"count":1});');
        done();
      })
    })

    it('should use first callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
          .get('/?callback=something&callback=somethingelse')
          .end(function(err, res){
            res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
            res.text.should.equal('typeof something === \'function\' && something({"count":1});');
            done();
          })
    })

    it('should ignore object callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback[a]=something')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'application/json');
        res.text.should.equal('{"count":1}');
        done();
      })
    })

    it('should allow renaming callback', function(done){
      var app = express();

      app.set('jsonp callback name', 'clb');

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?clb=something')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('typeof something === \'function\' && something({"count":1});');
        done();
      })
    })

    it('should allow []', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=callbacks[123]')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('typeof callbacks[123] === \'function\' && callbacks[123]({"count":1});');
        done();
      })
    })

    it('should disallow arbitrary js', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({});
      });

      request(app)
      .get('/?callback=foo;bar()')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('typeof foobar === \'function\' && foobar({});');
        done();
      })
    })

    it('should escape utf whitespace', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ str: '\u2028 \u2029 woot' });
      });

      request(app)
      .get('/?callback=foo')
      .end(function(err, res){
        res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
        res.text.should.equal('typeof foo === \'function\' && foo({"str":"\\u2028 \\u2029 woot"});');
        done();
      });
    });

    it('should not override previous Content-Types with no callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.example+json')
      .expect(200, '{"hello":"world"}', done);
    })

    it('should override previous Content-Types with callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/?callback=cb')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /cb\(\{"hello":"world"\}\);$/, done);
    })

    describe('when given primitives', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(null);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json');
          res.text.should.equal('null');
          done();
        })
      })
    })

    describe('when given an array', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp(['foo', 'bar', 'baz']);
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json');
          res.text.should.equal('["foo","bar","baz"]');
          done();
        })
      })
    })

    describe('when given an object', function(){
      it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.jsonp({ name: 'tobi' });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.headers.should.have.property('content-type', 'application/json');
          res.text.should.equal('{"name":"tobi"}');
          done();
        })
      })
    })

    describe('"json replacer" setting', function(){
      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json replacer', function(key, val){
          return '_' == key[0]
            ? undefined
            : val;
        });

        app.use(function(req, res){
          res.jsonp({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('{"name":"tobi"}');
          done();
        });
      })
    })

    describe('"json spaces" setting', function(){
      it('should be undefined by default', function(){
        var app = express();
        assert(undefined === app.get('json spaces'));
      })

      it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json spaces', 2);

        app.use(function(req, res){
          res.jsonp({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .end(function(err, res){
          res.text.should.equal('{\n  "name": "tobi",\n  "age": 2\n}');
          done();
        });
      })
    })
  })

  describe('.jsonp(status, object)', function(){
    it('should respond with json and set the .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp(201, { id: 1 });
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.headers.should.have.property('content-type', 'application/json');
        res.text.should.equal('{"id":1}');
        done();
      })
    })
  })

  describe('.jsonp(object, status)', function(){
    it('should respond with json and set the .statusCode for backwards compat', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ id: 1 }, 201);
      });

      request(app)
      .get('/')
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.headers.should.have.property('content-type', 'application/json');
        res.text.should.equal('{"id":1}');
        done();
      })
    })
  })
})
