module.exports = function(ctx){
var console = ctx.extend.console;

console.register('clean', 'Removed generated files and cache', require('./clean')(ctx));

console.register('help', 'Get help on a command', {
init: true
}, require('./help')(ctx));

console.register('init', 'Create a new Hexo folder', {
