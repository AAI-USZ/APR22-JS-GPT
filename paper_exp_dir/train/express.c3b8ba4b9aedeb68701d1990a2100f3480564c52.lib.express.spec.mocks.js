




var utils = require('express/utils')



var MockRequest = new Class({



httpVersion: '1.1',



constructor: function(method, path, options) {
this.method = method
this.url = path
this.connection = {
remoteAddress: '127.0.0.1'
}
this.headers = {
'host': 'localhost',
'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
'accept-language': 'en-us',
'connection': 'keep-alive'
}
utils.mixin(true, this, options)
}
})



var MockResponse = new Class({



writeHeader: function(code, headers) {
this.status = code
this.headers = headers
},



write: function(body) {
this.body = body
},



close: function() {
this.finished = true
}
})



function request(method, path, options, fn) {
var response = new MockResponse
var request = new MockRequest(method, path, options)
Express.server.route(request, response)
return response
}



reset = function() {
Express.routes = []
Express.plugins = []
Express.settings = {}
configure('test')
}



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
if (fn instanceof Function)
Express.routes.push(new Route(method, path, fn, options))
else
return request(method, path, options, fn)
}
}



get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')
