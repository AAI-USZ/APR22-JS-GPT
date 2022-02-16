var should = require('chai').should();
var moment = require('moment-timezone');

describe('SchemaTypeMoment', () => {
var SchemaTypeMoment = require('../../../lib/models/types/moment');
var type = new SchemaTypeMoment('test');

it('cast()', () => {
type.cast(1e8).should.eql(moment(1e8));
type.cast(new Date(2014, 1, 1)).should.eql(moment(new Date(2014, 1, 1)));
