Collection.prototype.method = function(name, fn){
this.prototype[name] = fn;
return this;
