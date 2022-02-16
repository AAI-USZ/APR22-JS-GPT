var EventEmitter = require('events').EventEmitter;
var util = require('util');



function Router(){
EventEmitter.call(this);



this.routes = {};
}

util.inherits(Router, EventEmitter);



var format = Router.prototype.format = function(str){
if (str == null){
str = '';
} else if (typeof str !== 'string'){
str = str + '';
}

str = str
.replace(/^\/+/, '')
.replace(/\\/g, '/')
.replace(/\?.*$/, '');


var last = str.substr(str.length - 1, 1);
if (!last || last === '/') str += 'index.html';

return str;
};



Router.prototype.get = function(source){
return this.routes[format(source)];
};



Router.prototype.set = function(source, callback){
var _callback;

source = format(source);

if (typeof callback === 'function'){
_callback = callback;
} else {
_callback = function(fn){
fn(null, callback);
};
}

if (_callback.modified == null) _callback.modified = true;

var route = this.routes[source] = _callback;



this.emit('update', source, route);

return this;
};



Router.prototype.remove = function(source){
source = format(source);

this.routes[source] = null;



this.emit('remove', source);

return this;
};

module.exports = Router;
