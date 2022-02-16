;(function(){




function require(p){
var path = require.resolve(p)
, mod = require.modules[path];
if (!mod) throw new Error('failed to require "' + p + '"');
if (!mod.exports) {
mod.exports = {};
mod.call(mod.exports, mod, mod.exports, require.relative(path));
}
return mod.exports;
}

require.modules = {};

require.resolve = function (path){
var orig = path
, reg = path + '.js'
, index = path + '/index.js';
return require.modules[reg] && reg
|| require.modules[index] && index
|| orig;
};

require.register = function (path, fn){
require.modules[path] = fn;
};

require.relative = function (parent) {
return function(p){
if ('.' != p.charAt(0)) return require(p);

var path = parent.split('/')
, segs = p.split('/');
path.pop();

for (var i = 0; i < segs.length; i++) {
var seg = segs[i];
if ('..' == seg) path.pop();
else if ('.' != seg) path.push(seg);
}

return require(path.join('/'));
};
};


require.register("browser/debug.js", function(module, exports, require){

module.exports = function(type){
return function(){

}
};
});

require.register("browser/diff.js", function(module, exports, require){

});

require.register("browser/events.js", function(module, exports, require){



exports.EventEmitter = EventEmitter;



function isArray(obj) {
return '[object Array]' == {}.toString.call(obj);
}



function EventEmitter(){};



EventEmitter.prototype.on = function (name, fn) {
if (!this.$events) {
this.$events = {};
}

if (!this.$events[name]) {
this.$events[name] = fn;
} else if (isArray(this.$events[name])) {
this.$events[name].push(fn);
} else {
this.$events[name] = [this.$events[name], fn];
}

return this;
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;



EventEmitter.prototype.once = function (name, fn) {
var self = this;

function on () {
self.removeListener(name, on);
fn.apply(this, arguments);
};

on.listener = fn;
this.on(name, on);

return this;
};



EventEmitter.prototype.removeListener = function (name, fn) {
if (this.$events && this.$events[name]) {
var list = this.$events[name];

if (isArray(list)) {
var pos = -1;

for (var i = 0, l = list.length; i < l; i++) {
if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
pos = i;
break;
}
}

if (pos < 0) {
return this;
}

list.splice(pos, 1);

if (!list.length) {
delete this.$events[name];
}
} else if (list === fn || (list.listener && list.listener === fn)) {
delete this.$events[name];
}
}

return this;
};



EventEmitter.prototype.removeAllListeners = function (name) {
if (name === undefined) {
this.$events = {};
return this;
}

if (this.$events && this.$events[name]) {
this.$events[name] = null;
}

return this;
};



EventEmitter.prototype.listeners = function (name) {
if (!this.$events) {
this.$events = {};
}

if (!this.$events[name]) {
this.$events[name] = [];
}

if (!isArray(this.$events[name])) {
this.$events[name] = [this.$events[name]];
}

return this.$events[name];
};



EventEmitter.prototype.emit = function (name) {
if (!this.$events) {
return false;
}

var handler = this.$events[name];

if (!handler) {
return false;
}

var args = [].slice.call(arguments, 1);

if ('function' == typeof handler) {
handler.apply(this, args);
} else if (isArray(handler)) {
var listeners = handler.slice();

for (var i = 0, l = listeners.length; i < l; i++) {
listeners[i].apply(this, args);
}
} else {
return false;
}

return true;
};
});

require.register("browser/fs.js", function(module, exports, require){

});

require.register("browser/path.js", function(module, exports, require){

});

require.register("browser/progress.js", function(module, exports, require){



module.exports = Progress;



function Progress() {
this.percent = 0;
this.size(0);
this.fontSize(11);
this.font('helvetica, arial, sans-serif');
}



Progress.prototype.size = function(n){
this._size = n;
return this;
};



Progress.prototype.text = function(str){
this._text = str;
return this;
};



Progress.prototype.fontSize = function(n){
this._fontSize = n;
return this;
};



Progress.prototype.font = function(family){
this._font = family;
return this;
};



Progress.prototype.update = function(n){
this.percent = n;
return this;
};



Progress.prototype.draw = function(ctx){
var percent = Math.min(this.percent, 100)
, size = this._size
, half = size / 2
, x = half
, y = half
, rad = half - 1
, fontSize = this._fontSize;

ctx.font = fontSize + 'px ' + this._font;

var angle = Math.PI * 2 * (percent / 100);
ctx.clearRect(0, 0, size, size);


ctx.strokeStyle = '#9f9f9f';
ctx.beginPath();
ctx.arc(x, y, rad, 0, angle, false);
ctx.stroke();


ctx.strokeStyle = '#eee';
ctx.beginPath();
ctx.arc(x, y, rad - 1, 0, angle, true);
ctx.stroke();


var text = this._text || (percent | 0) + '%'
, w = ctx.measureText(text).width;

ctx.fillText(
text
, x - w / 2 + 1
, y + fontSize / 2 - 1);

return this;
};

});

require.register("browser/tty.js", function(module, exports, require){

exports.isatty = function(){
return true;
};

exports.getWindowSize = function(){
return [window.innerHeight, window.innerWidth];
};
});

require.register("context.js", function(module, exports, require){



module.exports = Context;



function Context(){}



Context.prototype.runnable = function(runnable){
if (0 == arguments.length) return this._runnable;
this.test = this._runnable = runnable;
return this;
};



Context.prototype.timeout = function(ms){
this.runnable().timeout(ms);
return this;
};



Context.prototype.slow = function(ms){
this.runnable().slow(ms);
return this;
};



Context.prototype.inspect = function(){
return JSON.stringify(this, function(key, val){
if ('_runnable' == key) return;
