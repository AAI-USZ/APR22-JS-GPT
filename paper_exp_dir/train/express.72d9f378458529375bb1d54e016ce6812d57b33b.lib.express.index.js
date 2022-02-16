




var sys = require('sys'),
connect = require('connect'),
rest = require('connect/providers/rest');



exports.version = '0.14.0';



function Application(middleware){
this.config = [];
this.settings = {};
this.routes = { get: [], post: [], put: [], del: []};
connect.Server.call(this, (middleware || []).concat([
{ provider: 'rest', routes: this.routes }
]));
}

sys.inherits(Application, connect.Server);
