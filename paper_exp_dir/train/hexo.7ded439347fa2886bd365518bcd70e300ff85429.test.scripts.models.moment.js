'use strict';

const should = require('chai').should();
const moment = require('moment-timezone');

describe('SchemaTypeMoment', () => {
const SchemaTypeMoment = require('../../../lib/models/types/moment');
const type = new SchemaTypeMoment('test');

it('cast()', () => {
