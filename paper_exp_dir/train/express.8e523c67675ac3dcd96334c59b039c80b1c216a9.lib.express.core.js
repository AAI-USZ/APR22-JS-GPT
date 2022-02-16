


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



settings : {
basepath : '/',

cookie : {
maxAge : 3600
},

defaultRoute : {
callback : function() {
Express.respond('Page or file cannot be found', 'Not Found')
