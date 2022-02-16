
var express = require('../..')
, User = require('./user')
, app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');



function ferrets(user) {
return user.species == 'ferret';
}






app.get('/', function(req, res, next){
User.count(function(err, count){
if (err) return next(err);
User.all(function(err, users){
if (err) return next(err);
res.render('user', {
title: 'Users',
count: count,
users: users.filter(ferrets)
});
})
})
});









function count(req, res, next) {
User.count(function(err, count){
if (err) return next(err);
req.count = count;
next();
})
}

function users(req, res, next) {
User.all(function(err, users){
if (err) return next(err);
req.users = users;
next();
})
}

app.get('/middleware', count, users, function(req, res, next){
res.render('user', {
title: 'Users',
count: req.count,
users: req.users.filter(ferrets)
});
});















function count2(req, res, next) {
User.count(function(err, count){
if (err) return next(err);
res.locals.count = count;
next();
})
}

function users2(req, res, next) {
User.all(function(err, users){
if (err) return next(err);
res.locals.users = users.filter(ferrets);
next();
})
}

app.get('/middleware-locals', count2, users2, function(req, res, next){




res.render('user', { title: 'Users' });
});

