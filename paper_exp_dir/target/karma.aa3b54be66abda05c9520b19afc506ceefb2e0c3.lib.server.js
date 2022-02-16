newBrowser.execute(config.client);

globalEmitter.emit('browser_start', newBrowser);
