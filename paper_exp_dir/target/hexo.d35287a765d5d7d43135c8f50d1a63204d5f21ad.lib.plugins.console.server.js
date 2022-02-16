var ip = serverIp === '0.0.0.0' ? 'localhost' : serverIp;

log.i('Hexo is running at ' + 'http://%s:%d%s'.underline + '. Press Ctrl+C to stop.', ip, port, root);
