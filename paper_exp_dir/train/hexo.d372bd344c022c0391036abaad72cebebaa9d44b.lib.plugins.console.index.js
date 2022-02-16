var console = hexo.extend.console;

console.register('clean', 'Remove generated files and the cache', require('./clean'));

console.register('config', 'List the current configuration', require('./config'));

var deployOptions = {
alias: 'd',
options: [
{name: '--setup', desc: 'Setup without deployment'},
{name: '-g, --generate', desc: 'Generate before deployment'}
]
};

