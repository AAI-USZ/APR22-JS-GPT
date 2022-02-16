




var sys = require('sys'),
connect = require('connect'),
rest = require('connect/providers/rest');



exports.version = '0.14.0';



function Application(middleware){
this.config = {};
this.settings = {};
this.routes = { get: [], post: [], put: [], del: []};
connect.Server.call(this, (middleware || []).concat([
{ provider: 'rest', routes: this.routes }
]));
}

sys.inherits(Application, connect.Server);



Application.prototype.listen = function(port){
this.runConfig('any', 'development');
connect.Server.prototype.listen.call(this, port);
};



Application.prototype.runConfig = function(){
for (var i = 0, len = arguments.length; i < len; ++i) {
var env = arguments[i];
if (env in this.config) {
var config = this.config[env];
config.forEach(function(fn){
