






var express = require('../..')
, online = require('online')
, redis = require('redis')
, db = redis.createClient();



online = online(db);



var app = express();




app.use(function(req, res, next){

online.add(req.headers['user-agent']);
next();
});



function list(ids) {
return '<ul>' + ids.map(function(id){
return '<li>' + id + '</li>';
}).join('') + '</ul>';
}



app.get('/', function(req, res, next){
online.last(5, function(err, ids){
if (err) return next(err);
res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
});
});


if (!module.parent) {
