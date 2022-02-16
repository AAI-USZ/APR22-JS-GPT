


var express = require('../../')
, http = require('http')
, GithubView = require('./github-view')
, md = require('marked').parse;

var app = module.exports = express();


app.engine('md', function(str, options, fn){
try {
var html = md(str);
html = html.replace(/\{([^}]+)\}/g, function(_, name){
return options[name] || '';
})
fn(null, html);
} catch(err) {
fn(err);
}
})


app.set('views', 'visionmedia/express');


app.set('view', GithubView);

app.get('/', function(req, res){



res.render('examples/markdown/views/index.md', { title: 'Example' });
})

app.get('/Readme.md', function(req, res){

res.render('Readme.md');
})

if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
