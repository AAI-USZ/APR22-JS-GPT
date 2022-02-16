


var utils = require('./utils');



var StateMachine = module.exports = exports = function StateMachine () {
this.paths = {};
this.states = {};
}



StateMachine.ctor = function () {
var states = utils.args(arguments);

var ctor = function () {
StateMachine.apply(this, arguments);
this.stateNames = states;

var i = states.length
, state;

while (i--) {
state = states[i];
this.states[state] = {};
}
};

ctor.prototype.__proto__ = StateMachine.prototype;

states.forEach(function (state) {

ctor.prototype[state] = function (path) {
this._changeState(path, state);
}
});

return ctor;
};



StateMachine.prototype._changeState = function _changeState (path, nextState) {
var prevState = this.paths[path]
, prevBucket = this.states[prevState];

delete this.paths[path];
if (prevBucket) delete prevBucket[path];

this.paths[path] = nextState;
this.states[nextState][path] = true;
}

StateMachine.prototype.stateOf = function stateOf (path) {
return this.paths[path];
}

StateMachine.prototype.clear = function clear (state) {
var keys = Object.keys(this.states[state])
, i = keys.length
, path

while (i--) {
path = keys[i];
delete this.states[state][path];
delete this.paths[path];
}
}



StateMachine.prototype.some = function some () {
var self = this;
var what = arguments.length ? arguments : this.stateNames;
return Array.prototype.some.call(what, function (state) {
return Object.keys(self.states[state]).length;
});
}



StateMachine.prototype._iter = function _iter (iterMethod) {
return function () {
var numArgs = arguments.length
, states = utils.args(arguments, 0, numArgs-1)
, callback = arguments[numArgs-1];

if (!states.length) states = this.stateNames;

var self = this;

var paths = states.reduce(function (paths, state) {
return paths.concat(Object.keys(self.states[state]));
}, []);

return paths[iterMethod](function (path, i, paths) {
return callback(path, i, paths);
});
};
}



StateMachine.prototype.forEach = function forEach () {
this.forEach = this._iter('forEach');
return this.forEach.apply(this, arguments);
}



StateMachine.prototype.map = function map () {
this.map = this._iter('map');
return this.map.apply(this, arguments);
}

