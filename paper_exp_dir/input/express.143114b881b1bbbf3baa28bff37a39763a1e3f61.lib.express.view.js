


var posix = require('posix')

var path = set('views') + '/' + view,
ext = extname(path),
engine = require('support/' + ext),
posix
.cat(path)
.addCallback(function(content){
