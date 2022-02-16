




var Request = require('express/request').Request,
path = require('path'),
fs = require('fs')



fs.readFile = function(path, encoding, callback) {
if (encoding instanceof Function)
callback = encoding,
encoding = null
try {
callback(null, fs.readFileSync(path, encoding))
} catch (e) {
callback(e)
}
}



path.exists = function(path, callback) {
try {
fs.statSync(path)
callback(true)
} catch (e) {
callback(false)
}
}



fs.stat = function(path, callback) {
try {
callback(null, fs.statSync(path))
} catch (e) {
callback(e)
}
}



var MockRequest = new Class({



httpVersion: '1.1',



constructor: function(method, path, options) {
this.method = method
this.url = path
this.connection = { remoteAddress: '127.0.0.1' }
this.headers = {
'host': 'localhost',
'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
'accept-language': 'en-us',
'connection': 'keep-alive'
}
this.mergeDeep(options)
}
})



var MockResponse = new Class({



writeHead: function(code, headers) {
this.status = code
this.headers = headers
},



write: function(body) {
this.body = body
},



end: function() {
this.finished = true
}
})



function request(method, path, options, callback) {
var req = new MockRequest(method, path, options),
res = new MockResponse
Express.server.route(new Request(req, res))
return res
}



reset = function() {
Express.routes = []
Express.plugins = []
Express.settings = {}
Express.params = {}
delete Express.notFound
delete Express.error
configure('test')
}



function route(method) {
return function(path, options, callback){
if (options instanceof Function)
callback = options, options = {}
if (callback instanceof Function)
Express.routes.push(new Route(method, path, callback, options))
else
return request(method, path, options, callback)
}
}



get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')
