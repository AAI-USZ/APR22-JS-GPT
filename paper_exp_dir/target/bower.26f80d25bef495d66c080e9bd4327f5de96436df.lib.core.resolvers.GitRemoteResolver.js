if (!this._host || !this._config.shallowCloneHosts || this._config.shallowCloneHosts.indexOf(this._host) === -1) {
return Q.resolve(false);
}
