var fs = require('graceful-fs');
var path = require('path');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

var resolver = new Resolver({ source: 'foo' }, defaultConfig, new Logger());
resolver._createTempDir()
.then(function (dir) {


fs.writeFileSync(path.join(dir, 'some_file'), 'foo');
})
.done();
