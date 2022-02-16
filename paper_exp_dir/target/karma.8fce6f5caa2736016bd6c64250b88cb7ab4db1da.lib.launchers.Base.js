var cmd = path.normalize(env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform]);

if (!cmd) {
