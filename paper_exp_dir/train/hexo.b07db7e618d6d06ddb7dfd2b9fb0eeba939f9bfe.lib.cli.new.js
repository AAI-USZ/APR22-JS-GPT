var moment = require('moment'),
util = require('../util'),
file = util.file;

exports.post = function(args){
var slug = args[0];

if (slug === undefined) return false;

var date = moment().format('YYYY-MM-DD HH:mm:ss'),
root = process.cwd(),
target = '/source/_posts/' + slug + '.md';
