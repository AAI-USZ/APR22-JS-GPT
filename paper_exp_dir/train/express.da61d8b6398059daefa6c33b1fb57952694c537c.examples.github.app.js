


var express = require('../../lib/express')
, http = require('http');

var app = express();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



function request(path, fn){
var client = http.createClient(80, 'github.com')
, req = client.request('GET', '/api/v2/json' + path, { Host: 'github.com' });
req.on('response', function(res){
res.body = '';
res.on('data', function(chunk){ res.body += chunk; });
res.on('end', function(){
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



app.get('/repos/*', function(req, res, next){
var names = req.params[0].split('/')
, users = [];
(function fetchData(name){

if (name) {
console.log('... fetching \x1b[33m%s\x1b[0m', name);
request('/repos/show/' + name, function(err, user){
if (err) {
next(err)
} else {
user.totalWatchers = totalWatchers(user.repositories);
user.repos = sort(user.repositories);
user.name = name;
users.push(user);
fetchData(names.shift());
}
});

} else {
console.log('... done');
res.render('index', { users: users });
}
})(names.shift());
});


app.use(express.static(__dirname + '/public'));


app.listen(3000);
console.log('Express app started on port 3000');
