
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.isAbsolute()', function(){
it('should support windows', function(){
assert(utils.isAbsolute('c:\\'));
assert(!utils.isAbsolute(':\\'));
})

it('should unices', function(){
