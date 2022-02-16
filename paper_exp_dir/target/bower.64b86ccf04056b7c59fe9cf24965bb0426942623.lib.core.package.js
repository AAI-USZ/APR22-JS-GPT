fileExists(this.gitPath, function (exists) {
if (!exists) return this.emit('error', new Error('Unable to fetch package ' + this.name + ' (if the cache was deleted, run install again)'));

