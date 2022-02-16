


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
return mock
}


