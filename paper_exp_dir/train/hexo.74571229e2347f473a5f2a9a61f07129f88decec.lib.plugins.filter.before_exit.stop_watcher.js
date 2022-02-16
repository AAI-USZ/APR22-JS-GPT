'use strict';

var Promise = require('bluebird');

function stopWatcherFilter(){

return Promise.all([
stopWatcher(this.source),
stopWatcher(this.theme)
]);
}
