var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');
var tildify = require('tildify');
var chalk = require('chalk');

var Pattern = util.Pattern;
var escape = util.escape;
var join = pathFn.join;
var sep = pathFn.sep;

function Box(ctx, base, options){
this.options = _.extend({
presistent: true,
ignored: /[\/\\]\./,
ignoreInitial: true
}, options);

if (base.substring(base.length - 1) !== sep){
base += sep;
}

this.context = ctx;
this.base = base;
this.processors = [];
this.processingFiles = {};
this.watcher = null;
this.Cache = ctx.model('Cache');
this.bufferStore = {};

var _File = this.File = function(data){
File.call(this, data);
};

require('util').inherits(_File, File);

_File.prototype.box = this;

_File.prototype.render = function(options, callback){
if (!callback && typeof options === 'function'){
callback = options;
options = {};
}

var self = this;

return this.read().then(function(content){
return ctx.render.render({
text: content,
path: self.source
}, options);
}).nodeify(callback);
};

_File.prototype.renderSync = function(options){
return ctx.render.renderSync({
text: this.readSync(),
path: this.source
}, options);
};
}

function patternNoob(){
return {};
}

var escapeBackslash;

if (sep === '/'){
escapeBackslash = function(path){
return path;
};
} else {
escapeBackslash = function(path){

return path.replace(/\\/g, '/');
};
}

Box.prototype.addProcessor = function(pattern, fn){
if (!fn && typeof pattern === 'function'){
fn = pattern;
pattern = new Pattern(patternNoob);
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');
if (!(pattern instanceof Pattern)) pattern = new Pattern(pattern);

this.processors.push({
pattern: pattern,
process: fn
});
};

Box.prototype.process = function(callback){
var self = this;

return this._loadFiles().then(function(files){
return self._process(files);
}).nodeify(callback);
};

Box.prototype.load = Box.prototype.process;

function listDir(path){
return fs.listDir(path).catch(function(err){

if (err.cause.code !== 'ENOENT') throw err;
return [];
}).map(escapeBackslash);
}

Box.prototype._loadFiles = function(){
var base = this.base;
var Cache = this.Cache;
var self = this;
var ctx = this.context;
var relativeBase = escapeBackslash(base.substring(ctx.base_dir.length));
var regex = new RegExp('^' + escape.regex(relativeBase));
var baseLength = relativeBase.length;


var existed = Cache.find({_id: regex}).map(function(item){
return item._id.substring(baseLength);
});

return listDir(base).then(function(files){
var result = [];


var created = _.difference(files, existed);
var i, len, item;

for (i = 0, len = created.length; i < len; i++){
item = created[i];

result.push({
path: item,
type: 'create'
});
}

for (i = 0, len = existed.length; i < len; i++){
item = existed[i];

if (~files.indexOf(item)){
result.push({
path: item,
type: 'update'
});
} else {
result.push({
path: item,
type: 'delete'
});
}
}

return result;
}).map(function(item){
switch (item.type){
case 'create':
case 'update':
return self._handleUpdatedFile(item.path);

case 'delete':
return self._handleDeletedFile(item.path);
}
});
};

function getChecksum(path){
return new Promise(function(resolve, reject){
var hash = crypto.createHash('sha1');
var buffers = [];
var length = 0;
var stream = fs.createReadStream(path);

stream.on('readable', function(){
var chunk;

while ((chunk = stream.read()) != null){
length += chunk.length;
buffers.push(chunk);
hash.update(chunk);
}
}).on('end', function(){
resolve({
content: Buffer.concat(buffers, length),
checksum: hash.digest('hex')
});
}).on('error', reject);
});
}

Box.prototype._handleUpdatedFile = function(path){
var Cache = this.Cache;
var ctx = this.context;
var fullPath = join(this.base, path);
var self = this;

return getChecksum(fullPath).then(function(data){
var id = escapeBackslash(fullPath.substring(ctx.base_dir.length));
var cache = Cache.findById(id);
var checksum = data.checksum;

self.bufferStore[path] = data.content;

if (!cache){
return Cache.insert({
_id: id,
checksum: checksum
}).thenReturn({
type: 'create',
path: path
});
} else if (cache.checksum === checksum){
return {
type: 'skip',
path: path
};
} else {
cache.checksum = checksum;
return cache.save().thenReturn({
type: 'update',
path: path
});
}
});
};

Box.prototype._handleDeletedFile = function(path){
var fullPath = join(this.base, path);
var ctx = this.context;
var Cache = this.Cache;

this.bufferStore[path] = null;

return new Promise(function(resolve, reject){
var id = escapeBackslash(fullPath.substring(ctx.base_dir.length));
var cache = Cache.findById(id);
if (!cache) return resolve();

return cache.remove().then(resolve, reject);
}).thenReturn({
type: 'delete',
path: path
});
};

Box.prototype._process = function(files){
var self = this;
var ctx = this.context;
var base = this.base;

ctx.emit('processBefore', base);

return Promise.map(files, function(item){
return self._dispatch(item);
}).then(function(){
ctx.emit('processAfter', base);
});
};

Box.prototype._dispatch = function(item){
var path = item.path;
var File = this.File;
var self = this;
var ctx = this.context;
var base = this.base;
var start = process.hrtime();


if (this.processingFiles[path]) return;


this.processingFiles[path] = true;


return Promise.reduce(this.processors, function(count, processor){

var params = processor.pattern.match(path);
if (!params) return count;

var file = new File({
source: join(base, path),
path: path,
type: item.type,
params: params,
content: self.bufferStore[path]
});

return Promise.method(processor.process).call(ctx, file).thenReturn(count + 1);
}, 0).then(function(count){
if (count){
var interval = prettyHrtime(process.hrtime(start));
ctx.log.debug('Processed in %s: %s', chalk.cyan(interval), chalk.magenta(path));
}
}, function(err){
ctx.log.error({err: err}, 'Process failed: %s', chalk.magenta(path));
}).finally(function(){

