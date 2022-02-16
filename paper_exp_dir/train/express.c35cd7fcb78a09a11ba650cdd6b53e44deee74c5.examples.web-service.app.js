


var express = require('../../lib/express');

var app = express.createServer();












app.use('/api/v1', function(req, res, next){
var key = req.query['api-key'];


if (!key) return next(new Error('api key required'));


if (!~apiKeys.indexOf(key)) return next(new Error('invalid api key'));


req.key = key;
next();
});




app.use(app.router);






app.use(function(err, req, res, next){



res.send(500, { error: err.message });
});




app.use(function(req, res){
res.send(404, { error: "Lame, can't find that" });
});



function uid() {
return [
Math.random() * 0xffff | 0
, Math.random() * 0xffff | 0
, Math.random() * 0xffff | 0
, Date.now()
].join('-');
}






var apiKeys = [uid(), uid(), uid()];

console.log('valid keys:\n ', apiKeys.join('\n  '));



var repos = [
{ name: 'express', url: 'http://github.com/visionmedia/express' }
, { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
, { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

var users = [
{ name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
];

var userRepos = {
tobi: [repos[0], repos[1]]
, loki: [repos[1]]
, jane: [repos[2]]
};




app.get('/api/v1/users', function(req, res, next){
res.send(users);
});

app.get('/api/v1/repos', function(req, res, next){
res.send(repos);
});

app.get('/api/v1/user/:name/repos', function(req, res, next){
var name = req.params.name
, user = userRepos[name];

if (user) res.send(user);
else next();
});

app.listen(3000);
console.log('Express server listening on port 3000');
