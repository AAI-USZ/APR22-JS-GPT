


var fs = require('fs');

exports.boot = function(app){
bootControllers(app);
};



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
