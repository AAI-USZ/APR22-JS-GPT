'use strict';

module.exports = function(ctx) {
var console = ctx.extend.console;

console.register('clean', 'Remove generated files and cache.', require('./clean'));

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
{name: '-w, --watch', desc: 'Watch file changes'},
{name: '-b, --bail', desc: 'Raise an error if any unhandled exception is thrown during generation'}
]
}, require('./generate'));

console.register('list', 'List the information of the site', {
desc: 'List the information of the site.',
usage: '<type>',
arguments: [
{name: 'type', desc: 'Available types: page, post, route, tag, category'}
