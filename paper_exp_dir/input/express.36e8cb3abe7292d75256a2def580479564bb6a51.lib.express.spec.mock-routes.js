


function mockRequest(method, path, options) {
return {
method: method,
uri: {
full: path,
path: path,
queryString: '',
fragment: '',
params: {},
},
httpVersion: '1.1',
connection: {
remoteAddress: '127.0.0.1'
},
headers: {
'host': 'localhost:3000',
'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
'accept-language': 'en-us',
'connection': 'keep-alive'
}
}
}



var MockResponse = Class({
sendHeader: function(headers) {
this.headers = headers
},
sendBody: function(body) {
this.body = body
},
finish: function() {
this.finished = true
}
})

function request(method, path, options, fn) {
var response = new MockResponse
Express.server.route(mockRequest(method, path, options), response)
return response
}

