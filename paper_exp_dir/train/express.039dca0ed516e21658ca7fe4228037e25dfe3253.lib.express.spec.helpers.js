


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
