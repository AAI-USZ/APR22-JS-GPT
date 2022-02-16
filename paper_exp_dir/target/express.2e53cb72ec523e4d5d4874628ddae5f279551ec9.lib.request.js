req.acceptsEncoding = function(encoding){
return ~this.acceptedEncodings.indexOf(encoding);
};
