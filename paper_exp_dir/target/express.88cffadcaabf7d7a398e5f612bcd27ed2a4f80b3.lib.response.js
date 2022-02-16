var file = send(req, path, options);
file.on('error', error);
file.on('directory', next);
