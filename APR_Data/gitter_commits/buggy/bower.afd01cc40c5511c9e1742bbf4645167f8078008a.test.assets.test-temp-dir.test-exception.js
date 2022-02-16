var fs = require('fs');
var path = require('path');
var Resolver = require('../../../lib/core/resolvers/Resolver');

var resolver = new Resolver('foo');
resolver._createTempDir()
.then(function (dir) {
    // Need to write something to prevent tmp to automatically
    // remove the temp dir (it removes if empty)
    fs.writeFileSync(path.join(dir, 'some_file'), 'foo');

    // Force an error
    throw new Error('Some error');
})
.done();