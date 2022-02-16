
var express = require('../../..')
, fs = require('fs');

module.exports = function(parent, options){
var verbose = options.verbose;
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
verbose && console.log('\n   %s:', name);
var obj = require('./../controllers/' + name)
, name = obj.name || name
, prefix = obj.prefix || ''
, app = express()
, method
, path;


if (obj.engine) app.set('view engine', obj.engine);
app.set('views', __dirname + '/../controllers/' + name + '/views');


if (obj.before) {
path = '/' + name + '/:' + name + '_id';
app.all(path, obj.before);
verbose && console.log('     ALL %s -> before', path);
path = '/' + name + '/:' + name + '_id/*';
app.all(path, obj.before);
verbose && console.log('     ALL %s -> before', path);
}



for (var key in obj) {

if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;

switch (key) {
case 'show':
method = 'get';
path = '/' + name + '/:' + name + '_id';
break;
case 'list':
method = 'get';
path = '/' + name + 's';
break;
case 'edit':
method = 'get';
path = '/' + name + '/:' + name + '_id/edit';
break;
case 'update':
