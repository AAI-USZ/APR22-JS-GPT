var os = require('os');
var path = require('path');
var paths = require('./paths');



var proxy = process.env.HTTP_PROXY
|| process.env.http_proxy
|| null;

var httpsProxy = process.env.HTTPS_PROXY
|| process.env.https_proxy
|| proxy;




var userAgent = !proxy && !httpsProxy
? 'node/' + process.version + ' ' + process.platform + ' ' + process.arch
: 'curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5';

var defaults = {
'cwd': process.cwd(),
'directory': 'bower_components',
'registry': 'https://bower.herokuapp.com',
'shorthand-resolver': 'git://github.com/{{owner}}/{{package}}.git',
