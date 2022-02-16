


(function(){
Express = {
version : '0.0.1',
utilities : {},
modules  : [],
routes  : [],



Halt : function(){
this.toString = function() {
return 'Express.Halt'
}
},



response : {
headers : {},
cookie : {}
},



settings : {
basepath : '/',
defaultRoute : {
callback : function() {
Express.respond('Page or file cannot be found', 'Not Found')
}
}
},



RedirectHelpers : {
init : function() {
Express.home = Express.settings.basepath
},

onRequest : {
'set back to referrer' : function() {
Express.back =
Express.requestHeader('Referer') ||
Express.requestHeader('Referrer')
}
}
},

ContentLength : {
onResponse : {
'set content length' : function() {
