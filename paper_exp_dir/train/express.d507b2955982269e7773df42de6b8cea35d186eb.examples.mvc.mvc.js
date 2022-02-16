


var fs = require('fs'),
express = require('../../lib/express');

exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger({ format: ':method :url :status' }));
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(app.router);
app.use(express.staticProvider(__dirname + '/public'));


app.use(function(req, res){
res.render('404');
});


app.set('views', __dirname + '/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');


app.dynamicHelpers({
request: function(req){
return req;
},

hasMessages: function(req){
return Object.keys(req.session.flash || {}).length;
},

messages: function(req){
return function(){
var msgs = req.flash();
return Object.keys(msgs).reduce(function(arr, type){
return arr.concat(msgs[type]);
}, []);
}
}
});
}



function bootControllers(app) {
fs.readdir(__dirname + '/controllers', function(err, files){
if (err) throw err;
files.forEach(function(file){
bootController(app, file);
});
});
}



function bootController(app, file) {
var name = file.replace('.js', ''),
actions = require('./controllers/' + name),
plural = name + 's',
prefix = '/' + plural;


if (name == 'app') {
prefix = '/';
}

Object.keys(actions).map(function(action){
var fn = controllerAction(name, plural, action, actions[action]);
switch(action) {
case 'index':
app.get(prefix, fn);
break;
case 'show':
app.get(prefix + '/:id.:format?', fn);
break;
case 'add':
app.get(prefix + '/:id/add', fn);
break;
case 'create':
app.post(prefix + '/:id', fn);
break;
case 'edit':
app.get(prefix + '/:id/edit', fn);
break;
case 'update':
app.put(prefix + '/:id', fn);
break;
case 'destroy':
app.del(prefix + '/:id', fn);
break;
}
});
}



function controllerAction(name, plural, action, fn) {
return function(req, res, next){
var render = res.render,
format = req.params.format,
path = __dirname + '/views/' + name + '/' + action + '.html';
res.render = function(obj, options, fn){
if (action == 'show' && format && format === 'json') {
res.send(obj);
} else {
res.render = render;
options = options || {};
options.locals = options.locals || {};
