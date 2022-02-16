


(function(){

var lastRequest



var OriginalXMLHttpRequest = 'XMLHttpRequest' in this ?
XMLHttpRequest :
function(){}
var OriginalActiveXObject = 'ActiveXObject' in this ?
ActiveXObject :
undefined



var MockXMLHttpRequest = function() {
this.requestHeaders = {}
}

MockXMLHttpRequest.prototype = {
status: 0,
async: true,
readyState: 0,
responseXML: null,
responseText: '',
abort: function(){},
onreadystatechange: function(){},



getAllResponseHeaders : function(){
return JSpec.inject(this.responseHeaders, '', function(buf, key, val){
return buf + key + ': ' + val + '\r\n'
})
},



getResponseHeader : function(name) {
return this.responseHeaders[name.toLowerCase()]
},


