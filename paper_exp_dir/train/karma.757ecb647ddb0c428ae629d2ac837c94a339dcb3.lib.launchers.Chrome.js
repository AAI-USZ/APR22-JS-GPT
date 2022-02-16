var BaseBrowser = require('./Base');


var ChromeBrowser = function() {
BaseBrowser.apply(this, arguments);

this._getOptions = function(url) {


return [
'--user-data-dir=' + this._tempDir,
'--no-default-browser-check',
'--no-first-run',
'--disable-default-apps',
'--start-maximized',
url
];
};
};

ChromeBrowser.prototype = {
name: 'Chrome',

DEFAULT_CMD: {
linux: 'google-chrome',
