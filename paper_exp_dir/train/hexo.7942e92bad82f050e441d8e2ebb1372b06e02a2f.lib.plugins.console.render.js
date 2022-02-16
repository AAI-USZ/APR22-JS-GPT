var Promise = require('bluebird');
var pathFn = require('path');
var tildify = require('tildify');
var prettyHrtime = require('pretty-hrtime');
var fs = require('hexo-fs');
var chalk = require('chalk');

function renderConsole(args){
var baseDir = this.base_dir;
var render = this.render;
var log = this.log;
var files = args._;
var output = args.o || args.output;
var engine = args.engine;

return Promise.each(files, function(path){
var src = pathFn.resolve(baseDir, path);
var start = process.hrtime();

return render.render({
path: src,
engine: engine
}).then(function(result){
if (typeof result === 'object'){
if (args.pretty){
result = JSON.stringify(result, null, '  ');
} else {
result = JSON.stringify(result);
}
}

if (!output) return console.log(result);

var extname = pathFn.extname(path);
var dest = pathFn.resolve(output, path.substring(0, path.length - extname.length + 1)) + render.getOutput(path);
var interval = prettyHrtime(process.hrtime(start));

log.info('Rendered in %s: %s -> %s', chalk.cyan(interval), chalk.magenta(tildify(src)), chalk.magenta(tildify(dest)));
return fs.writeFile(dest, result);
});
});
}

module.exports = renderConsole;
