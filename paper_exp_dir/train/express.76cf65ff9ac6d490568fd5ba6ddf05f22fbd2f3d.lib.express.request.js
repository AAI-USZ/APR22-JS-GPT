






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
