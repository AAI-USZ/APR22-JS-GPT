var console = hexo.extend.console;

console.register('clean', 'Remove generated files and the cache', require('./clean'));

var configOptions = {
options: [
{name: '--json', desc: 'Print in JSON format'}
]
};

console.register('config', 'List the current configuration', configOptions, require('./config'));

var deployOptions = {
alias: 'd',
options: [
{name: '--setup', desc: 'Setup without deployment'},
{name: '-g, --generate', desc: 'Generate before deployment'}
]
};

console.register('deploy', 'Deploy your website', deployOptions, require('./deploy'));

var generateOptions = {
alias: 'g',
options: [
{name: '-d, --deploy', desc: 'Deploy after generated'},
{name: '-w, --watch', desc: 'Watch file changes'}
]
};

console.register('generate', 'Generate static files', generateOptions, require('./generate'));

console.register('help', 'Get help on a command', {init: true}, require('./help'));

var initOptions = {
init: true,
desc: 'Create a new Hexo folder at the specified path or the current directory.',
usage: '[destination]',
};

console.register('init', 'Create a new Hexo folder', initOptions, require('./init'));

var listOptions = {
desc: 'List the information of the site.',
usage: '<type>',
arguments: [
{name: 'type', desc: 'Available types: route'}
]
};

console.register('list', 'List the information of the site', listOptions, require('./list'));

var migrateOptions = {
init: true,
usage: '<type>'
};

console.register('migrate', 'Migrate your site from other system to Hexo', migrateOptions, require('./migrate'));

var newOptions = {
alias: 'n',
usage: '[layout] <title>',
arguments: [
{name: 'layout', desc: 'Post layout. Use post, page, draft or whatever you want.'},
{name: 'title', desc: 'Post title. Wrap it with quotations to escape.'}
],
options: [
{name: '-r, --replace', desc: 'Replace the current post if existed.'},
{name: '-s, --slug', desc: 'Post slug. Customize the URL of the post.'},
{name: '-p, --path', desc: 'Post path. Customize the path of the post.'}
]
};

console.register('new', 'Create a new post', newOptions, require('./new'));

var renderOptions = {
desc: 'Render the files with Markdown or other engines and save them at the specified path or the current directory.',
usage: '<file1> [file2] ...',
