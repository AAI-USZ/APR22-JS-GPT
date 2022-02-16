




var StaticFile = require('express/static').File,
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
utils = require('express/utils'),
url = require('url')



InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})



InvalidResponseBody = ExpressError.extend({
name: 'InvalidResponseBody',
init: function(request) {
this.message = request.method + ' ' + JSON.encode(request.url.pathname) + ' did not respond with a body string'
}
})





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



init: function(request, response) {
utils.mixin(true, this, request)
response.headers = {}
this.response = response
this.url = url.parse(this.url)
this.url.pathname = exports.normalizePath(this.url.pathname)
this.params = this.params || {}
this.params.path =  {}
this.params.get = this.url.query ? queryString.parseQuery(this.url.query) : {}
this.params.post = this.params.post || {}
this.plugins = Express.plugins.map(function(plugin){
return new plugin.klass(plugin.options)
})
},



header: function(key, val) {
return val === undefined ?
this.headers[key.toLowerCase()] :
this.response.headers[key.toLowerCase()] = val
},



param: function(key) {
return this.params.get[key] ||
this.params.post[key] ||
this.params.path[key]
},



accepts: function() {
var accept = this.header('accept')
return accept
? arguments.any(function(path){
var type = mime.type(path)
return accept.indexOf(type) !== -1 ||
accept.indexOf(type.split('/')[0]+'/*') !== -1
})
: true
},



status: function(code) {
this.response.status = code
return this
},



halt: function(code, body, encoding, callback) {
this.status(code = code || 404)
if (body = body || statusBodies[code])
return this.respond(body, encoding, callback)
throw new InvalidStatusCode(code)
},



respond: function(body, encoding, callback) {
this.response.body = body
var self= this;
this.trigger('response', null, function (error) {
if (typeof self.response.body != 'string') {callback( new InvalidResponseBody(self) ); return; }
self.response.writeHeader(self.response.status, self.response.headers)
self.response.write(self.response.body, encoding)
self.response.close()
});
},



contentType: function(path) {
this.header('content-type', mime.type(path))
return this
},



trigger: function(name, data, callback) {
data = data || {}
data.merge({ request: this, response: this.response })

var pluginsExecuted= 0,
plugin= undefined,
totalPlugins= this.plugins.length,
pluginResult,
self= this;
var callNextPlugin= function(error) {
if( error || pluginsExecuted >= totalPlugins ) callback(error);
else {
try{
plugin= self.plugins.at(pluginsExecuted++);
if( plugin && plugin.trigger ) {
pluginResult= plugin.trigger(new Event(name, data), callNextPlugin);
if(pluginResult) callNextPlugin()
}
else callNextPlugin();
} catch(e) {
callNextPlugin(e);
}
}
};
callNextPlugin();
return this
},



download: function(path) {
return this.attachment(basename(path)).sendfile(path)
},



attachment: function(path) {
this.header('content-disposition', path
? 'attachment; filename="' + path + '"'
: 'attachment')
return this
},



sendfile: function(path) {
(new StaticFile(path)).send(this)
return this
}
})
