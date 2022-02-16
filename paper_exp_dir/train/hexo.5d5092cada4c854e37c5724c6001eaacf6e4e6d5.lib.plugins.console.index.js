'use strict';

module.exports = function(ctx){
var console = ctx.extend.console;

console.register('clean', 'Removed generated files and cache.', require('./clean'));

console.register('config', 'Get or set configurations.', {
usage: '[name] [value]',
arguments: [
{name: 'name', desc: 'Setting name. Leave it blank if you want to show all configurations.'},
{name: 'value', desc: 'New value of a setting. Leave it blank if you just want to show a single configuration.'}
]
}, require('./config'));

console.register('deploy', 'Deploy your website.', {
options: [
{name: '--setup', desc: 'Setup without deployment'},
{name: '-g, --generate', desc: 'Generate before deployment'}
]
}, require('./deploy'));

console.register('generate', 'Generate static files.', {
options: [
{name: '-d, --deploy', desc: 'Deploy after generated'},
{name: '-f, --force', desc: 'Force regenerate'},
{name: '-w, --watch', desc: 'Watch file changes'}
]
}, require('./generate'));

console.register('help', 'Get help on a command.', {
init: true
}, require('./help'));

console.register('init', 'Create a new Hexo folder.', {
