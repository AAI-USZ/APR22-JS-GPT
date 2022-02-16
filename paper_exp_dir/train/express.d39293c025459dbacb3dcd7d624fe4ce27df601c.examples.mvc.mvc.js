


var fs = require('fs')
, express = require('../../lib/express');

exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger(':method :url :status'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));


app.error(function(err, req, res){
console.dir(err)
res.render('500');
});


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
var name = file.replace('.js', '')
, actions = require('./controllers/' + name)
, plural = name + 's'
, prefix = '/' + plural;


if (name == 'app') prefix = '/';

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
var render = res.render
, format = req.params.format
, path = __dirname + '/views/' + name + '/' + action + '.html';
res.render = function(obj, options, fn){
res.render = render;

if (typeof obj === 'string') {
return res.render(obj, options, fn);
}


if (action == 'show' && format) {
if (format === 'json') {
return res.send(obj);
} else {
throw new Error('unsupported format "' + format + '"');
}
}


res.render = render;
options = options || {};

if (action == 'index') {
options[plural] = obj;
} else {
options[name] = obj;
}
return res.render(path, options, fn);
};
fn.apply(this, arguments);
};
}
