that._logger.debug('progress', receivedMb + 'MB of ' + totalMb + 'MB downloaded, ' + state.percent + '%');
.on('replay', function (nr, error) {
that.logger.debug('retry', 'Retrying request to ' + this._source + ' because it failed with ' + error.code);
