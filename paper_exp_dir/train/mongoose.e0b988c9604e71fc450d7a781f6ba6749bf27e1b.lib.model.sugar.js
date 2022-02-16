
var QueryPromise = function(cmd,args,model){
this.model = model;
this.op = {
name : cmd,
callback : (args.length) ? ( (args[args.length-1] instanceof Function) ? args.pop() : null ) : null,
args : args
};
return this;
};

