if (this._config.proxy || this._config.httpsProxy) {
this._source = this._source.replace('git://', 'https://');
}
