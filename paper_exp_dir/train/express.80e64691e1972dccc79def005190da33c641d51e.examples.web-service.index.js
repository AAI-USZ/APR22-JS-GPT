

var express = require('../../');

var app = module.exports = express();





function error(status, msg) {
var err = new Error(msg);
err.status = status;
return err;
}










app.use('/api', function(req, res, next){
var key = req.query['api-key'];


if (!key) return next(error(400, 'api key required'));


if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));


req.key = key;
next();
});






var apiKeys = ['foo', 'bar', 'baz'];



var repos = [
{ name: 'express', url: 'https://github.com/expressjs/express' },
{ name: 'stylus', url: 'https://github.com/learnboost/stylus' },
{ name: 'cluster', url: 'https://github.com/learnboost/cluster' }
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





app.get('/api/users', function(req, res, next){
res.send(users);
});


app.get('/api/repos', function(req, res, next){
res.send(repos);
});

