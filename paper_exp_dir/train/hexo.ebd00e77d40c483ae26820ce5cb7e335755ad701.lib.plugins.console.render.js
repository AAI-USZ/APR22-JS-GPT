'use strict';

const pathFn = require('path');
const tildify = require('tildify');
const prettyHrtime = require('pretty-hrtime');
const fs = require('hexo-fs');
const chalk = require('chalk');

function renderConsole(args) {

if (!args._.length) {
return this.call('help', {_: 'render'});
}

const baseDir = this.base_dir;
const src = pathFn.resolve(baseDir, args._[0]);
const { output } = args.o || args;
const start = process.hrtime();
const { log } = this;

return this.render.render({
path: src,
engine: args.engine
}).then(result => {
if (typeof result === 'object') {
if (args.pretty) {
result = JSON.stringify(result, null, '  ');
} else {
result = JSON.stringify(result);
}
}

if (!output) return console.log(result);

const dest = pathFn.resolve(baseDir, output);
const interval = prettyHrtime(process.hrtime(start));

log.info('Rendered in %s: %s -> %s', chalk.cyan(interval), chalk.magenta(tildify(src)), chalk.magenta(tildify(dest)));
return fs.writeFile(dest, result);
});
}

module.exports = renderConsole;
