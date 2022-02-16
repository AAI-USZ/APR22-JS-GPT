

require.paths.unshift(__dirname + '/../../support');



var express = require('express')
, app = express.createServer()
, site = require('./site')
, user = require('./user');



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.staticProvider(__dirname + '/public'));



app.get('/', site.index);



app.all('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
