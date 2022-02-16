var ScriptBrowser = function(id, emitter, timeout, retry, script) {
this.launch = function(names, port, urlRoot, timeout, retryLimit) {
browser = new Cls(Launcher.generateId(), emitter, timeout, retryLimit, name);
