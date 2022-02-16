
(function(){
Express = {
version : '0.0.1',
routes  : [],



response : {
body : null,
status : 200,
headers : {},
cookie : {}
},



defaults : {
cookie : {
maxAge : 3600
},
route : {
callback : function() {
Express.status('Not Found')
'Not Found'
}
}
},

hookCallbacks : {
request : [
function (request, response) {
Express.request = request
request.headers = Express.arrayToHash(request.headers)
},

function (request, response) {
Express.response.cookie = request.cookie = Express.parseCookie(request.headers['Cookie'])
}
]
},

hook : function(name) {
for (var name in this.hookCallbacks)
