'test app.param(fn)': function(){
app.param(function(name, fn){
if (fn instanceof RegExp) {
