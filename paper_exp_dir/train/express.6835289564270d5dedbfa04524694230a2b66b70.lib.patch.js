



var http = require('http');
var ServerResponse = http.ServerResponse;


if (ServerResponse.prototype._hasConnectPatch) {
return;
}


var setHeader = ServerResponse.prototype.setHeader;
var writeHead = ServerResponse.prototype.writeHead;



ServerResponse.prototype.setHeader = function(field, val){
var key = field.toLowerCase()
, prev;


if (this._headers && 'set-cookie' == key) {
if (prev = this.getHeader(field)) {
if (Array.isArray(prev)) {
val = prev.concat(val);
} else if (Array.isArray(val)) {
val = val.concat(prev);
} else {
