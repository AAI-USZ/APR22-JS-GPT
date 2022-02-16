if (!config.singleRun && config.browserDisconnectTolerance) {
log.debug('browserDisconnectTolerance set to 0, because of singleRun');
config.browserDisconnectTolerance = 0;
