'use strict';

const moment = require('moment-timezone');

describe('SchemaTypeMoment', () => {
const SchemaTypeMoment = require('../../../lib/models/types/moment');
const type = new SchemaTypeMoment('test');

it('cast()', () => {
type.cast(1e8).should.eql(moment(1e8));
type.cast(new Date(2014, 1, 1)).should.eql(moment(new Date(2014, 1, 1)));
type.cast('2014-11-03T07:45:41.237Z').should.eql(moment('2014-11-03T07:45:41.237Z'));
