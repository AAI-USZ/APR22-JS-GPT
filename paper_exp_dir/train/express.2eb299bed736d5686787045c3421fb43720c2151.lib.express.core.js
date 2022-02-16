
(function(){
Express = {
version : '0.0.1',
routes  : [],
response : {
body : null,
status : 200,
headers : {},
statuses : {
'ok'                 : 200,
'created'            : 201,
'accepted'           : 202,
'no content'         : 204,
'reset content'      : 205,
'partial content'    : 206,
'moved permanently'  : 301,
'found'              : 302,
'see other'          : 303,
'not modified'       : 304,
'use proxy'          : 305,
'switch proxy'       : 306,
'temporary redirect' : 307,
'bad request'        : 400,
'unauthorized'       : 401,
'forbidden'          : 403,
'not found'          : 404
}
},

defaultRoute : {
callback : function() {
Express.status('Not Found')
return 'Not Found'
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
Express.request = request
Express.request.uri.path = Express.normalizePath(Express.request.uri.path)
Express.response.body = Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

server : {



listen : function(port, callback) {
new node.http.Server(callback).listen(port)
puts('Express listening to http://localhost:' + port)
}
},



hashToArray : function(hash) {
var array = []
for (var key in hash)
if (hash.hasOwnProperty(key))
array.push([key, hash[key]])
return array
},



arrayToHash : function(array) {
var hash = {}
for (var i = 0, len = array.length; i < len; ++i)
hash[array[i][0]] = array[i][1]
return hash
},



status : function(value) {
this.response.status = this.response.statuses[value.toString().toLowerCase()] || value
},



header : function(name, value) {
return value ? this.response.headers[name] = value :
this.response.headers[name]
},



param : function(key, defaultValue) {
return this.request.uri.params[key] || defaultValue
},

parseNestedParams : function(params) {
for (var key in params)
if (params.hasOwnProperty(key))
if (parts = key.split('['))
if (parts.length > 1)
for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
if (i == len - 1) {
var name = parts[i].replace(']', '')
prop[name] = params[key]
prop = params, delete params[key]
}
else {
var name = parts[i].replace(']', '')
