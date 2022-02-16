glob('./' + config.directory + '/*', function (err, dirs) {
if (err) return this.emit('error', err);
dirs.forEach(function (dir) {
