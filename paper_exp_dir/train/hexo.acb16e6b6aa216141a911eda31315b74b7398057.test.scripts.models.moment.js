const should = require('chai').should();
const moment = require('moment-timezone');

describe('SchemaTypeMoment', () => {
const SchemaTypeMoment = require('../../../lib/models/types/moment');
const type = new SchemaTypeMoment('test');

it('cast()', () => {
type.cast(1e8).should.eql(moment(1e8));
type.cast(new Date(2014, 1, 1)).should.eql(moment(new Date(2014, 1, 1)));
type.cast('2014-11-03T07:45:41.237Z').should.eql(moment('2014-11-03T07:45:41.237Z'));
type.cast(moment(1e8)).valueOf().should.eql(1e8);
});

it('cast() - default', () => {
const type = new SchemaTypeMoment('test', {default: moment});
moment.isMoment(type.cast()).should.be.true;
});

it('cast() - language', () => {
const lang = 'zh-tw';
const format = 'LLLL';
const type = new SchemaTypeMoment('test', {language: lang});
const now = Date.now();

type.cast(now).format(format).should.eql(moment(now).locale(lang).format(format));
});

it('cast() - timezone', () => {
const timezone = 'Etc/UTC';
