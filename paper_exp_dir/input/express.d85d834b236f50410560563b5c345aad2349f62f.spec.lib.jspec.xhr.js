


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
