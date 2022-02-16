
(function(){
Express = {
version : '0.0.1',
routes  : [],
response : {
body : null,
status : 200,
headers : {}
},

defaultRoute : {
callback : function() {
Express.status('Not Found')
return 'Not Found'
}
},

