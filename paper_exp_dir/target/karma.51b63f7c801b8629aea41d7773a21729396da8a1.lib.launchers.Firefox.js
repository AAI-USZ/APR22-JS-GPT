var p = spawn(command, ['-CreateProfile', 'testacular-' + id + ' ' + self._tempDir, '--new-instance']);
p.stderr.on('data', function(data) {
errorOutput += data.toString();
