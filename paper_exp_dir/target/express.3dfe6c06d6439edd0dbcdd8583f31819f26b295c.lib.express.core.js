response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
hashToArray : function(hash) {
var array = []
