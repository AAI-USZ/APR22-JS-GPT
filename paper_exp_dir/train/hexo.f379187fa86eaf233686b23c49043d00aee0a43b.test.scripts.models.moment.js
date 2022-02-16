'use strict';

var should = require('chai').should();
var moment = require('moment-timezone');

describe('SchemaTypeMoment', function() {
var SchemaTypeMoment = require('../../../lib/models/types/moment');
var type = new SchemaTypeMoment('test');

it('cast()', function() {
type.cast(1e8).should.eql(moment(1e8));
type.cast(new Date(2014, 1, 1)).should.eql(moment(new Date(2014, 1, 1)));
type.cast('2014-11-03T07:45:41.237Z').should.eql(moment('2014-11-03T07:45:41.237Z'));
type.cast(moment(1e8)).valueOf().should.eql(1e8);
});

it('cast() - default', function() {
var type = new SchemaTypeMoment('test', {default: moment});
moment.isMoment(type.cast()).should.be.true;
});

it('cast() - language', function() {
var lang = 'zh-tw';
var format = 'LLLL';
var type = new SchemaTypeMoment('test', {language: lang});
var now = Date.now();

type.cast(now).format(format).should.eql(moment(now).locale(lang).format(format));
});

it('cast() - timezone', function() {
var timezone = 'Etc/UTC';
var format = 'LLLL';
var type = new SchemaTypeMoment('test', {timezone: timezone});
var now = Date.now();

type.cast(now).format(format).should.eql(moment(now).tz(timezone).format(format));
});

function shouldThrowError(value) {
try {
type.validate(value);
} catch (err) {
err.should.have.property('message', '`' + value + '` is not a valid date!');
}
}

it('validate()', function() {
type.validate(moment(1e8)).valueOf().should.eql(1e8);
shouldThrowError(moment.invalid());
