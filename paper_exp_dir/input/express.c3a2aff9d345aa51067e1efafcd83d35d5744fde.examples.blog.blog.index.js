


var express = require('./../../../lib/express'),
fs = require('fs');


var app = module.exports = express.createServer();


app.set('views', __dirname + '/views');


var posts = JSON.parse(fs.readFileSync(__dirname + '/posts.json', 'utf8'));


app.set('view engine', 'ejs');

app.dynamicHelpers({
basepath: function(){



}
});

app.get('/', function(req, res){
res.render('index', {
locals: {
posts: posts
}
});
});

app.get('/post/:id', function(req, res, params){
res.render('post', {
locals: {
post: posts[params.id]
}
});
});
