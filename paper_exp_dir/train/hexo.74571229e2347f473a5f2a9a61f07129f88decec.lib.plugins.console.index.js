'use strict';

module.exports = function(ctx){
var console = ctx.extend.console;

console.register('clean', 'Removed generated files and cache.', require('./clean'));

console.register('config', 'List the current configuration.', require('./config'));

console.register('deploy', 'Deploy your website.', {
options: [
{name: '--setup', desc: 'Setup without deployment'},
