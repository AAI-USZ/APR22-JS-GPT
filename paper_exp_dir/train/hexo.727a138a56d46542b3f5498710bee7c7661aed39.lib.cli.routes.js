var extend = require('../extend'),
route = require('../route');

extend.console.register('routes', 'Display all routes', function(args){
console.log('Loading.');

require('../generate')({preview: true}, function(){
var list = Object.keys(route.list()).sort();

console.log('\nRoutes:');

