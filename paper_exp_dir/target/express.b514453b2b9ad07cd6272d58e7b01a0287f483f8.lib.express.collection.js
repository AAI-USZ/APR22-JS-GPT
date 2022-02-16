if (this.arr.every)
return this.arr.every(fn)
return this.reduce(true, function(state, val, key){
