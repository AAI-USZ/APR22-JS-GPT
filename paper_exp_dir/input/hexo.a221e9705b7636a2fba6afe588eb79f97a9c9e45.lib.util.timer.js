var Timer = module.exports = function(fn, delay){
var remaining = delay,
timer,
start;

this.pause = function(){
clearTimeout(timer);
remaining -= new Date() - start;
