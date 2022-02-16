

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
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



app.all('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);



app.get('/posts', post.list);

app.listen(3000);
console.log('Express app started on port 3000');
