log.debug('List of files has changed, trying to execute');
if (!capturedBrowsers.areAllReady([])) {
socket.write('Waiting for previous execution...\n');
