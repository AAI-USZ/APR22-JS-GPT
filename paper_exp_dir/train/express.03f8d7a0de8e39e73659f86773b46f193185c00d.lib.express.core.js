


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
for (i = 0, len = this.modules.length; i < len; ++i)
if (typeof this.modules[i][name] == 'function')
this.modules[i][name].apply(this.modules[i], this.argsArray(arguments, 1))
},



addModule : function(module) {
Express.settings[module.name] = {}

if ('init' in module)
module.init.call(module)

if ('settings' in module) {
if (!module.name) throw 'module name is required when using .settings'
for (var name in module.settings)
if (module.settings.hasOwnProperty(name))
Express.settings[module.name][name] = module.settings[name]
}

if ('utilities' in module)
for (var name in module.utilities)
