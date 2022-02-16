var async = require('async'),
path = require('path'),
Hexo = require('./core'),
Logger = require('./logger');

var defaultCallback = function(err){
process.exit(err ? 1 : 0);
};

module.exports = function(cwd, args, callback){
if (typeof callback !== 'function') callback = defaultCallback;

var hexo = global.hexo = new Hexo(),
configfile = args.config || '_config.yml';

hexo.bootstrap(cwd, args);
hexo.configfile = path.join(hexo.base_dir, configfile);

async.eachSeries([
'logger',
'extend',
'config',
'update',
'database',
'box',
'plugins',
'scripts'
], function(name, next){
require('./loaders/' + name)(next);
}, function(err){
if (err){
if (hexo.log != null){
return hexo.log.e(err);
} else {
