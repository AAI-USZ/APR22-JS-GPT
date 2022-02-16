

function VirtualType () {
this.getters = [];
this.setters = [];
}



VirtualType.prototype.get = function (fn) {
this.getters.push(fn);
return this;
};



VirtualType.prototype.set = function (fn) {
this.setters.push(fn);
return this;
};



VirtualType.prototype.applyGetters = function (value, scope) {
var v = value;
for (var l = this.getters.length - 1; l >= 0; l--){
v = this.getters[l].call(scope, v);
}
return v;
};



VirtualType.prototype.applySetters = function (value, scope) {
var v = value;
for (var l = this.setters.length - 1; l >= 0; l--){
this.setters[l].call(scope, v);
}
return v;
};

module.exports = VirtualType;
