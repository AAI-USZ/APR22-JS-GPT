res.cookie = function(name, val, options){
options = options || {};
var secret = this.req.secret;
