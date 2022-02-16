


var start = require('./common')
, mongoose = start.mongoose
, assert = require('assert')
, Schema = mongoose.Schema
, random = require('../lib/utils').random



var capped = new Schema({ key: 'string', val: 'number' });
capped.set('capped', { size: 1000 });

var coll = 'capped_' + random();



