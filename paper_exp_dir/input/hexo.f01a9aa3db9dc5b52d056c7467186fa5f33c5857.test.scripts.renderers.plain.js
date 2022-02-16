'use strict';

var should = require('chai').should();

var r = require('../../../lib/plugins/renderer/plain');

r({text: '123'}).should.eql('123');
});
});
