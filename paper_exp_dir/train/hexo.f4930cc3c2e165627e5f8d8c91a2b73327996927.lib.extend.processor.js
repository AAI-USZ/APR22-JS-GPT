var ExtendError = require('../error').ExtendError,
Pattern = require('../box/pattern');



var Processor = module.exports = function(){


this.store = [];
};



Processor.prototype.list = function(){
return this.store;
};



Processor.prototype.register = function(rule, fn){
if (!fn){
if (typeof rule === 'function'){
fn = rule;
rule = /(.*)/;
} else {
throw new ExtendError('fn is required');
}
}

this.store.push({
pattern: new Pattern(rule),
process: fn
});
};
