'use strict';

var should = require('chai').should();
var moment = require('moment-timezone');

describe('SchemaTypeMoment', function(){
var SchemaTypeMoment = require('../../../lib/models/types/moment');
var type = new SchemaTypeMoment('test');

it('cast()', function(){
