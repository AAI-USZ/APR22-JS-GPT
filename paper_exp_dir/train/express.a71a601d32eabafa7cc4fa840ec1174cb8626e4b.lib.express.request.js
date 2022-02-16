






exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



params: {},



init: function(request, response) {
process.mixin(true, this, request)
response.headers = {}
this.response = response
this.uri.path = exports.normalizePath(this.uri.path)
this.uri.params = parseNestedParams(this.uri.params)
this.plugins = $(Express.plugins).map(function(plugin){
return new plugin.klass(plugin.options)
})
this.uri.post =
this.header('content-type') == 'application/x-www-form-urlencoded' ?
parseParams(this.body) :
{}
},



header: function(key, val) {
return val === undefined ?
this.headers[key.toLowerCase()] :
this.response.headers[key.toLowerCase()] = val
},



param: function(key) {
return this.params[key] ||
this.uri.post[key] ||
this.uri.params[key]
},



accepts: function(path) {
return this.header('accept').indexOf(mime(path)) != -1
