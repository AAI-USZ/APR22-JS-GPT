


(function(){



var OriginalXMLHttpRequest = 'XMLHttpRequest' in this ?
XMLHttpRequest :
function(){}
var OriginalActiveXObject = 'ActiveXObject' in this ?
ActiveXObject :
undefined



var MockXMLHttpRequest = function() {
this.requestHeaders = {}
}

