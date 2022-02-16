module.exports = function(ctx){
return function(args){
var command = args._[0];
var list = ctx.extend.console.list();
var str = '';
var item, options;

if (list.hasOwnProperty(command) && command !== 'help'){
item = list[command];
options = item.options;
