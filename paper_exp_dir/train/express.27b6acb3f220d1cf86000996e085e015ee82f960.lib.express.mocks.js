




function mockRequest(request) {
var mock = {
listeners: [],
method: 'GET',
headers: {},
uri: {
path: '/',
params: {}
},
setBodyEncoding : function(type) {
this.bodyEncoding = type
},
addListener : function(event, callback) {
this.listeners.push({ event : event, callback : callback })
if (event == 'body') {
var body = this.body
this.body = ''
callback(body)
}
else
callback()
}
}
JSpec.extend(mock, request)
mock.uri.params = mock.uri.params || {}
return mock
}



function mockResponse(response) {
var mock = {
body: null,
status: 200,
headers: [],
sendHeader: function(){},
