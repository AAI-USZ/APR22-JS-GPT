


var express = require('./../../lib/express'),
connect = require('connect'),
http = require('http');

var app = express.createServer();



app.set('views', __dirname + '/views');



function request(path, fn){
var client = http.createClient(80, 'github.com'),
req = client.request('GET', '/api/v2/json' + path, { Host: 'github.com' });
req.addListener('response', function(res){
res.body = '';
res.addListener('data', function(chunk){ res.body += chunk; });
res.addListener('end', function(){
try {
fn(null, JSON.parse(res.body));
} catch (err) {
fn(err);
}
});
});
req.end();
}



function sort(repos){
return repos.sort(function(a, b){
if (a.watchers == b.watchers) return 0;
if (a.watchers > b.watchers) return -1;
if (a.watchers < b.watchers) return 1;
});
}



function totalWatchers(repos) {
return repos.reduce(function(sum, repo){
return sum + repo.watchers;
}, 0);
}



app.get('/', function(req, res){
res.redirect('/repos/visionmedia');
});



app.get(/^\/repos\/(\w+)(?:\.\.(\w+))?/, function(req, res, params, next){
var names = params,
users = [];
(function fetchData(name){

if (name) {
console.log('... fetching %s', name);
request('/repos/show/' + name, function(err, user){
if (err) {
next(err)
} else {
