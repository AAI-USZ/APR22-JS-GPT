

require.paths.unshift(__dirname + '/../../support');



var express = require('express')
, app = express.createServer()
, site = require('./site')
, post = require('./post')
, user = require('./user');



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.staticProvider(__dirname + '/public'));



app.get('/', site.index);
