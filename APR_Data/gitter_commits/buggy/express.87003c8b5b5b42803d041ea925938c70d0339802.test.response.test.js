
/**
 * Module dependencies.
 */

var express = require('express'),
    Buffer = require('buffer').Buffer;

module.exports = {
    'test #send()': function(assert){
        var app = express.createServer();

        app.get('/html', function(req, res){
            res.send('<p>test</p>', { 'Content-Language': 'en' });
        });
        
        app.get('/json', function(req, res){
            res.header('X-Foo', 'bar');
            res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
        });
        
        app.get('/text', function(req, res){
            res.header('X-Foo', 'bar');
            res.contentType('.txt');
            res.send('wahoo');
        });
        
        app.get('/status', function(req, res){
            res.send(404);
        });
        
        app.get('/error', function(req, res){
            res.send('Oh shit!', { 'Content-Type': 'text/plain' }, 500);
        });
        
        app.get('/buffer', function(req, res){
            res.send(new Buffer('wahoo!'));
        });
        
        app.get('/noargs', function(req, res, next){
            res.send();
        });

        assert.response(app,
            { url: '/html' },
            { body: '<p>test</p>', headers: { 'Content-Language': 'en', 'Content-Type': 'text/html; charset=utf-8' }});
        assert.response(app,
            { url: '/json' },
            { body: '{"foo":"bar"}', status: 201, headers: { 'Content-Type': 'application/json', 'X-Foo': 'baz' }});
        assert.response(app,
            { url: '/text' },
            { body: 'wahoo', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Foo': 'bar' }});
        assert.response(app,
            { url: '/status' },
            { body: 'Not Found', status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' }});
        assert.response(app,
            { url: '/error' },
            { body: 'Oh shit!', status: 500, headers: { 'Content-Type': 'text/plain' }});
        assert.response(app,
            { url: '/buffer' },
            { body: 'wahoo!', headers: { 'Content-Type': 'application/octet-stream' }});
        assert.response(app,
            { url: '/noargs' },
            { status: 204 }, function(res){
                assert.equal(undefined, res.headers['content-type']);
                assert.equal(undefined, res.headers['content-length']);
            });
    },
    
    'test #contentType()': function(assert){
        var app = express.createServer();
        
        app.get('/html', function(req, res){
            res.contentType('index.html');
            res.writeHead(200, res.headers);
            res.end('<p>yay</p>');
        });
        
        assert.response(app,
            { url: '/html' },
            { body: '<p>yay</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    },
    
    'test #attachment()': function(assert){
        var app = express.createServer();
        
        app.get('/style.css', function(req, res){
            res.attachment();
            res.send('some stylezzz');
        });

        app.get('/*', function(req, res){
            res.attachment(req.params[0]);
            res.send('whatever');
        });
        
        assert.response(app,
            { url: '/javascripts/jquery.js' },
            { body: 'whatever', headers: { 'Content-Disposition': 'attachment; filename="jquery.js"' }});
        assert.response(app,
            { url: '/style.css' },
            { body: 'some stylezzz', headers: { 'Content-Disposition': 'attachment' }});
    },
    
    'test #redirect()': function(assert){
        var app = express.createServer(),
            app2 = express.createServer();
        
        app2.set('home', '/blog');

        app2.redirect('google', 'http://google.com');

        app2.redirect('blog', function(req, res){
            return req.params.id
                ? '/user/' + req.params.id + '/blog'
                : null;
        });
        
        app.get('/', function(req, res){
            res.redirect('http://google.com', 301);
        });
        
        app.get('/back', function(req, res){
            res.redirect('back');
        });
        
        app.get('/home', function(req, res){
            res.redirect('home');
        });
        
        app2.get('/', function(req, res){
            res.redirect('http://google.com', 301);
        });
        
        app2.get('/back', function(req, res){
            res.redirect('back');
        });
        
        app2.get('/home', function(req, res){
            res.redirect('home');
        });
        
        app2.get('/google', function(req, res){
            res.redirect('google');
        });

        app2.get('/user/:id', function(req, res){
            res.header('X-Foo', 'bar');
            res.redirect('blog');
        });
        
        assert.response(app,
            { url: '/' },
            { body: 'Redirecting to http://google.com', status: 301, headers: { Location: 'http://google.com' }});
        assert.response(app,
            { url: '/back' },
            { body: 'Redirecting to /', status: 302, headers: { Location: '/', 'Content-Type': 'text/plain' }});
        assert.response(app,
            { url: '/back', headers: { Referer: '/foo' }},
            { body: 'Redirecting to /foo', status: 302, headers: { Location: '/foo' }});
        assert.response(app,
            { url: '/back', headers: { Referrer: '/foo' }},
            { body: 'Redirecting to /foo', status: 302, headers: { Location: '/foo' }});
        assert.response(app,
            { url: '/home' },
            { body: 'Redirecting to /', status: 302, headers: { Location: '/' }});

        assert.response(app2,
            { url: '/' },
            { body: 'Redirecting to http://google.com', status: 301, headers: { Location: 'http://google.com' }});
        assert.response(app2,
            { url: '/back' },
            { body: 'Redirecting to /blog', status: 302, headers: { Location: '/blog' }});
        assert.response(app2,
            { url: '/home' },
            { body: 'Redirecting to /blog', status: 302, headers: { Location: '/blog' }});
        assert.response(app2,
            { url: '/google' },
            { body: 'Redirecting to http://google.com', headers: { Location: 'http://google.com' }});
        assert.response(app2,
            { url: '/user/12' },
            { body: 'Redirecting to /user/12/blog', headers: { Location: '/user/12/blog', 'X-Foo': 'bar' }});
    },
    
    'test #sendfile()': function(assert){
        var app = express.createServer();

        app.get('/*', function(req, res, next){
            var file = req.params[0],
                filePath = __dirname + '/fixtures/' + file;
            res.sendfile(filePath, function(err, path){
                assert.equal(path, filePath);
                if (err) next(err);
            });
        });
        
        app.use(express.errorHandler());
        
        assert.response(app,
            { url: '/user.json' },
            { body: '{"name":"tj"}', status: 200, headers: { 'Content-Type': 'application/json' }});
        assert.response(app,
            { url: '/hello.haml' },
            { body: '%p Hello World', status: 200, headers: { 'Content-Type': 'application/octet-stream' }});
        assert.response(app,
            { url: '/doesNotExist' },
            { body: 'Internal Server Error', status: 500 });
        assert.response(app,
            { url: '/partials' },
            { body: 'Internal Server Error', status: 500 });
    },
    
    'test #download()': function(assert){
        var app = express.createServer();
        
        app.get('/json', function(req, res, next){
            var filePath = __dirname + '/fixtures/user.json';
            res.download(filePath, 'account.json', function(err, path){
                assert.equal(filePath, path);
            });
        });

        app.get('/*', function(req, res, next){
            res.download(__dirname + '/fixtures/' + req.params[0]);
        });
        
        assert.response(app,
            { url: '/user.json' },
            { body: '{"name":"tj"}', status: 200, headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="user.json"'
            }});

        assert.response(app,
            { url: '/json' },
            { body: '{"name":"tj"}', status: 200, headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="account.json"'
            }});
    },
    
    'test #cookie()': function(assert){
        var app = express.createServer();
        
        app.get('/', function(req, res){
            res.cookie('rememberme', 'yes', { expires: new Date(1), httpOnly: true });
            res.redirect('/');
        });
        
        assert.response(app,
            { url: '/' },
            function(res){
                assert.length(res.headers['set-cookie'], 1);
                assert.equal(
                    'rememberme=yes; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly',
                    res.headers['set-cookie'][0]);
            });
    },
    
    'test #clearCookie()': function(assert){
        var app = express.createServer();
        
        app.get('/', function(req, res){
            res.clearCookie('rememberme');
            res.redirect('/');
        });
        
        assert.response(app,
            { url: '/' },
            function(res){
                assert.length(res.headers['set-cookie'], 1);
                assert.equal(
                    'rememberme=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    res.headers['set-cookie'][0]);
            });
    },
    
    'test HEAD': function(assert){
        var app = express.createServer();
        
        app.get('/', function(req, res, next){
            res.send('Hello World');
        });
        
        assert.response(app,
            { url: '/', method: 'HEAD' },
            { body: '', headers: { 'Content-Length': 11 }});
    }
};