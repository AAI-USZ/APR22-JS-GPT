




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, mime = require('mime');



var defaultFormatters = exports.formatters = {
s: function(val){
return String(val);
},

d: function(val){
return val | 0;
}
};



req.header = function(name, defaultValue){
switch (name = name.toLowerCase()) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer
|| defaultValue;
default:
return this.headers[name] || defaultValue;
}
};



req.get = function(field, param){
var val = this.header(field);
if (!val) return '';
var regexp = new RegExp(param + ' *= *(?:"([^"]+)"|([^;]+))', 'i');
if (!regexp.exec(val)) return '';
return RegExp.$1 || RegExp.$2;
};



req.accepts = function(type){
var accept = this.header('Accept');


if (type && '.' == type[0]) type = type.substr(1);


if (!accept || '*/*' == accept) {
return true;
} else if (type) {

if (!~type.indexOf('/')) type = mime.lookup(type);


if (~accept.indexOf(type)) return true;


type = type.split('/')[0] + '/*';
return !! ~accept.indexOf(type);
} else {
return false;
}
};



req.param = function(name, defaultValue){

if (this.params
&& this.params.hasOwnProperty(name)
&& undefined !== this.params[name]) {
return this.params[name];
}

if (undefined !== this.query[name]) return this.query[name];


if (this.body && undefined !== this.body[name]) return this.body[name];
