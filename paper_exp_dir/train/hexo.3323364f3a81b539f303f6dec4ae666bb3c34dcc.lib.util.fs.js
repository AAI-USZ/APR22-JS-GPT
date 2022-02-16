var Promise = require('bluebird');
var fs = require('graceful-fs');
var pathFn = require('path');
var escape = require('./escape');

var dirname = pathFn.dirname;
var join = pathFn.join;
var escapeEOL = escape.eol;
var escapeBOM = escape.bom;

var statAsync = Promise.promisify(fs.stat);
var readdirAsync = Promise.promisify(fs.readdir);
var unlinkAsync = Promise.promisify(fs.unlink);
var mkdirAsync = Promise.promisify(fs.mkdir);
var renameAsync = Promise.promisify(fs.rename);
var writeFileAsync = Promise.promisify(fs.writeFile);
var appendFileAsync = Promise.promisify(fs.appendFile);
var rmdirAsync = Promise.promisify(fs.rmdir);
var readFileAsync = Promise.promisify(fs.readFile);
var createReadStream = fs.createReadStream;
var createWriteStream = fs.createWriteStream;

function exists(path){
return new Promise(function(resolve, reject){
fs.exists(path, resolve);
});
}

function mkdirs(path){
var parent = dirname(path);

return exists(parent).then(function(exist){
if (!exist) return mkdirs(parent);
}).then(function(){
return mkdirAsync(path);
});
}

function mkdirsSync(path){
var parent = dirname(path);
var exist = fs.existsSync(parent);

if (!exist) mkdirsSync(parent);
fs.mkdirSync(path);
}

function checkParent(path){
var parent = dirname(path);

return exists(parent).then(function(exist){
if (!exist) return mkdirs(parent);
}).catch(function(err){
if (err.cause.code !== 'EEXIST') throw err;
});
}

function checkParentSync(path){
var parent = dirname(path);
var exist = fs.existsSync(parent);

if (exist) return;

try {
mkdirsSync(parent);
} catch (err){
if (err.code !== 'EEXIST') throw err;
}
}

function writeFile(path, data, options){
return checkParent(path).then(function(){
return writeFileAsync(path, data, options);
});
}

function writeFileSync(path, data, options){
checkParentSync(path);
fs.writeFileSync(path, data, options);
}

function appendFile(path, data, options){
return checkParent(path).then(function(){
return appendFileAsync(path, data, options);
});
}

function appendFileSync(path, data, options){
checkParentSync(path);
fs.appendFileSync(path, data, options);
}

function copyFile(src, dest){
return checkParent(dest).then(function(){
return new Promise(function(resolve, reject){
var rs = createReadStream(src);
var ws = createWriteStream(dest);

rs.pipe(ws)
.on('error', reject);

ws.on('close', resolve)
.on('error', reject);
});
});
}

function trueFn(){
return true;
}

function ignoreHiddenFiles(ignore){
if (!ignore) return trueFn;

return function(item){
return item[0] !== '.';
};
}

function ignoreFilesRegex(regex){
if (!regex) return trueFn;

