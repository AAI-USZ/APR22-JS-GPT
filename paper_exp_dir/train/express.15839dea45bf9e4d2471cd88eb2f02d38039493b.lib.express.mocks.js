


(function(){



function mockRequest(request) {
var mock = {
method : 'GET',
headers : [],
uri : {
path : '/',
params : {}
}
}
JSpec.extend(mock, request)
mock.uri.params = mock.uri.params || {}
return mock
}



function mockResponse(response) {
var mock = {
body : null,
status : 200,
headers : [],
sendHeader : function(){},
sendBody : function(){},
finish : function(){ this.finished = true }
}
JSpec.extend(mock, response)
return mock
}



var orig = Express.server.callback
function mockCallback(request, response) {
orig(mockRequest(request), mockResponse(response))
}



function mockRouteFunctionFor(method) {
var orig =  Express.routeFunctionFor(method)
return function(path, options, callback) {
if ((options && options.constructor == Function) ||
(callback && callback.constructor == Function))
return orig.apply(Express, arguments)
var request = mockRequest({ method : method.toUpperCase(), uri : { path : path }})
var response = mockResponse()
Express.server.callback(request, response)
return Express.response
}
}



JSpec.include({
init : function() {
Express.server.callback = mockCallback
},

utilities : {
mockRequest : mockRequest,
mockResponse : mockResponse,
get  : mockRouteFunctionFor('get'),
post : mockRouteFunctionFor('post'),
put  : mockRouteFunctionFor('put'),
del  : mockRouteFunctionFor('delete')
}
})

})()
