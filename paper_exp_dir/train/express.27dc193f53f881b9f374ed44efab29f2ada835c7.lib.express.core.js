


(function(){
Express = {
version : '0.0.1',
routes  : [],



Break : function(){
this.toString = function() {
return 'Express.Break'
}
},



response : {
headers : {},
cookie : {}
},



defaults : {
cookie : {
maxAge : 3600
},
route : {
callback : function() {
Express.respond('Page or file cannot be found', 'Not Found')
}
}
},

hookCallbacks : {
request : [



function (request, response) {
Express.response.cookie = request.cookie = Express.parseCookie(request.headers['Cookie'])
}
],

response : [



function(request, response) {
Express.header('Content-Length', (Express.response.body || '').length)
}
]
},



hook : function(name, args) {
if (this.hookCallbacks[name])
for (i = 0, len = this.hookCallbacks[name].length; i < len; ++i)
if (typeof this.hookCallbacks[name][i] == 'function')
this.hookCallbacks[name][i].apply(this, this.argsArray(arguments, 1))
},



use : function(name, callback) {
Express.hookCallbacks[name].push(callback)
},



start : function(port, host) {
this.server.listen(port || 3000, host, this.server.callback)
},

server : {



listen : function(port, host, callback) {
node.http.createServer(callback).listen(port, host)
puts('Express started at http://' + (host || '127.0.0.1') + ':' + port + '/')
