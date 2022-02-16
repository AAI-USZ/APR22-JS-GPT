var expect = require('expect.js');
var helpers = require('../helpers');

describe('rc', function() {
var tempDir = new helpers.TempDir();
var tempDirBowerrc = new helpers.TempDir();

var rc = require('../../lib/util/rc');

tempDir.prepare({
'.bowerrc': {
key: 'value'
},
'child/.bowerrc': {
key2: 'value2'
},
'child2/.bowerrc': {
key: 'valueShouldBeOverwriteParent'
},
'child3/bower.json': {
name: 'without-bowerrc'
},
'other_dir/.bowerrc': {
key: 'othervalue'
}
});

tempDirBowerrc.prepare({
'.bowerrc/foo': {
key: 'bar'
}

