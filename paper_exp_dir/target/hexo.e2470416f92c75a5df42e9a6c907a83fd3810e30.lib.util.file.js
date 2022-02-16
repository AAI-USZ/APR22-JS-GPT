fs.open(destination, 'w', function(err, fd) {
fs.write(fd, content, 0, 'utf8', function(err, written, buffer) {
