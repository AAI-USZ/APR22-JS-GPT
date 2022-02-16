







var _ = require('lodash')


var File = function (path, mtime, doNotCache) {

this.path = path


this.originalPath = path


this.contentPath = path

this.mtime = mtime
this.isUrl = false

this.doNotCache = _.isUndefined(doNotCache) ? false : doNotCache
}

File.prototype.toString = function () {
return this.path
}


module.exports = File
