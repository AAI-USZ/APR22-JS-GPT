


var express = require('../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');


app.locals.layout = '/layouts/default';




app.set('view engine', 'ejs');

app.get('/', function(req, res){
res.render('pages/default');
});

app.get('/alternate', function(req, res){



res.render('pages/alternate');
});

app.listen(3000);
console.log('Express app started on port 3000');
