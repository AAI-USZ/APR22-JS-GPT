var console = hexo.extend.console;

console.register('clean', 'Remove generated files and the cache', require('./clean'));

var configOptions = {
options: [
{name: '--json', desc: 'Print in JSON format'}
]
};

