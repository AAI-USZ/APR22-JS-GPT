



var http = require('http');
var ServerResponse = http.ServerResponse;


if (ServerResponse.prototype._hasConnectPatch) {
return;
}


var setHeader = ServerResponse.prototype.setHeader;
var writeHead = ServerResponse.prototype.writeHead;



ServerResponse.prototype.setHeader = function(field, val){
var key = field.toLowerCase();

if ('content-type' == key && this.charset) {
val += '; charset=' + this.charset;
}

return setHeader.call(this, field, val);
};

ServerResponse.prototype.writeHead = function(statusCode, reasonPhrase, headers){
