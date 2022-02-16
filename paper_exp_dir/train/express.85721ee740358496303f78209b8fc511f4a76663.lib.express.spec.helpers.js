


(function(){



function mockRequest(request) {
var mock = {
method : 'GET',
uri : {
params : {}
}
}
JSpec.extend(mock, request)
return mock
}



function mockResponse(response) {
var mock = {
body : null,
status : 200,
sendHeader : function(){},
sendBody : function(){},
finish : function(){ this.finished = true }
}
JSpec.extend(mock, response)
return mock
}

function mockRouteFunctionFor(method) {
var orig = Express.routeFunctionFor(method)
return function(path, options, callback) {
p(Express.argsArray(arguments))
if (options.constructor == Function) callback = options, options = {}
if (callback) orig.apply(Express, arguments)
}
}

JSpec.include({
