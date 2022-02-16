



var app = module.parent.exports;

app.get('/', function(req, res){
res.send('<p>Visit <a href="/blog">/blog</a>'
+ ' or <a href="/contact">/contact</a></p>');
});
