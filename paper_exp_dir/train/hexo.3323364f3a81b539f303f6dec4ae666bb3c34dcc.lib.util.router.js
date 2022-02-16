var EventEmitter = require('events').EventEmitter;
var util = require('util');



function Router(){
EventEmitter.call(this);



this.routes = {};
}

util.inherits(Router, EventEmitter);

