
/**
 * Module dependencies.
 */

var express = require('express'),
    Buffer = require('buffer').Buffer;

module.exports = {
    '#send()': function(assert){
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
            { body: 'wahoo!' });
    },
    
    '#contentType': function(assert){
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
    
    '#attachment': function(assert){
        var app = express.createServer();
        
        app.get('/style.css', function(req, res){
            res.attachment();
            res.send('some stylezzz');
        });

        app.get('/*', function(req, res, params){
            res.attachment(params.splat[0]);
            res.send('whatever');
        });
        
        assert.response(app,
            { url: '/javascripts/jquery.js' },
            { body: 'whatever', headers: { 'Content-Disposition': 'attachment; filename="jquery.js"' }});
        assert.response(app,
            { url: '/style.css' },
            { body: 'some stylezzz', headers: { 'Content-Disposition': 'attachment' }});
    },
    
    '#redirect()': function(assert){
        var app = express.createServer(),
            app2 = express.createServer();
        
        app2.set('home', '/blog');

        app2.redirect = {
            google: 'http://google.com'
        };

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
        
        assert.response(app,
            { url: '/' },
            { body: '', status: 301, headers: { Location: 'http://google.com' }});
        assert.response(app,
            { url: '/back' },
            { body: '', status: 302, headers: { Location: '/' }});
        assert.response(app,
            { url: '/back', headers: { Referer: '/foo' }},
            { body: '', status: 302, headers: { Location: '/foo' }});
        assert.response(app,
            { url: '/back', headers: { Referrer: '/foo' }},
            { body: '', status: 302, headers: { Location: '/foo' }});
        assert.response(app,
            { url: '/home' },
            { body: '', status: 302, headers: { Location: '/' }});

        assert.response(app2,
            { url: '/' },
            { body: '', status: 301, headers: { Location: 'http://google.com' }});
        assert.response(app2,
            { url: '/back' },
            { body: '', status: 302, headers: { Location: '/blog' }});
        assert.response(app2,
            { url: '/home' },
            { body: '', status: 302, headers: { Location: '/blog' }});
        assert.response(app2,
            { url: '/google' },
            { body: '', headers: { Location: 'http://google.com' }});
        
    }
};