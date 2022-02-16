
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



