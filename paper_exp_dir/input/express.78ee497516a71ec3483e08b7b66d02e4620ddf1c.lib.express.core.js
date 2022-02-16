


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
onInit : {
'set home' : function(){
Express.home = Express.settings.basepath
}
}
},

ContentLength : {
onRequest : {
'set content length' : function() {
Express.header('Content-Length', (Express.response.body || '').length)
}
}
},



hook : function(name, args) {
var results = []
for (i = 0, len = this.modules.length; i < len; ++i)
if (typeof this.modules[i][name] == 'function')
results.push(this.modules[i][name].apply(this.modules[i], this.argsArray(arguments, 1)))
return results
},



