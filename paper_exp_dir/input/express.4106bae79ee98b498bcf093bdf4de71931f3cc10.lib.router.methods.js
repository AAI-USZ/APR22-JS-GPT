







var RFC2518 = ['PROPFIND', 'PROPPATCH', 'MKCOL', 'COPY', 'MOVE', 'LOCK', 'UNLOCK'];



var RFC3253 = ['VERSION-CONTROL', 'REPORT', 'CHECKOUT', 'CHECKIN', 'UNCHECKOUT', 'MKWORKSPACE', 'UPDATE', 'LABEL', 'MERGE', 'BASELINE-CONTROL', 'MKACTIVITY'];



var RFC3648 = ['ORDERPATCH'];



var RFC3744 = ['ACL'];



var RFC5323 = ['SEARCH'];



var RFC5789 = ['PATCH'];



module.exports = [].concat(
RFC2616
, RFC2518
, RFC3253
, RFC3648
, RFC3744
, RFC5323
, RFC5789).map(function(method){
return method.toLowerCase();
});
