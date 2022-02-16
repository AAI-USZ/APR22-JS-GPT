module.exports = function(ctx){
var console = ctx.extend.console;

console.register('clean', 'Removed generated files and cache.', require('./clean'));

console.register('config', 'List the current configuration.', require('./config'));

console.register('deploy', 'Deploy your website.', {
options: [
{name: '--setup', desc: 'Setup without deployment'},
{name: '-g, --generate', desc: 'Generate before deployment'}
]
}, require('./deploy'));

console.register('generate', 'Generate static files.', {
options: [
{name: '-d, --deploy', desc: 'Deploy after generated'},
{name: '-w, --watch', desc: 'Watch file changes'}
]
}, require('./generate'));

console.register('help', 'Get help on a command.', {
init: true
}, require('./help'));

console.register('init', 'Create a new Hexo folder.', {
init: true,
desc: 'Create a new Hexo folder at the specified path or the current directory.',
usage: '[destination]'
}, require('./init'));

console.register('list', 'List the information of the site', {
desc: 'List the information of the site.',
usage: '<type>',
arguments: [
{name: 'type', desc: 'Available types: page, post, route'}
]
}, require('./list'));

console.register('migrate', 'Migrate your site from other system to Hexo.', {
init: true,
usage: '<type>',
arguments: [
{name: 'type', desc: 'Migrator type.'}
]
