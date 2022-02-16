var path = require('path');
var paths = require('./paths');


var proxy = process.env.HTTP_PROXY || process.env.http_proxy || null;

var httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || proxy;

var noProxy = process.env.NO_PROXY || process.env.no_proxy;



var userAgent =
!proxy && !httpsProxy
? 'node/' +
process.version +
