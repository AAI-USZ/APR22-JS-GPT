
/**
 * Module dependencies.
 */

var express = require('./../../lib/express'),
    connect = require('connect');

var app = express.createServer(
    connect.logger(),
    connect.cookieDecoder(),
    connect.session()
);

app.get('/', function(req, res){
    var body = '';
    if (req.session.views) {
        ++req.session.views;
    } else {
        req.session.views = 1;
        body += '<p>First time visiting? view this page in several browsers :)</p>';
    }
    res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);