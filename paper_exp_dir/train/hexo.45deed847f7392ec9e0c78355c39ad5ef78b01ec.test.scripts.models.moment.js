var should = require('chai').should();
var moment = require('moment');

describe('SchemaTypeMoment', function(){
var SchemaTypeMoment = require('../../../lib/models/types/moment');
var type = new SchemaTypeMoment('test');

it('cast()', function(){
type.cast(1e8).should.eql(moment(1e8));
type.cast(new Date(2014, 1, 1)).should.eql(moment(new Date(2014, 1, 1)));
type.cast('2014-11-03T07:45:41.237Z').should.eql(moment('2014-11-03T07:45:41.237Z'));
type.cast(moment(1e8)).should.eql(moment(1e8));
});

it('cast() - default', function(){
var type = new SchemaTypeMoment('test', {default: moment});
moment.isMoment(type.cast()).should.be.true;
});

function shouldThrowError(value){
type.validate(value).should.have.property('message', '`' + value + '` is not a valid date!');
}

it('validate()', function(){
type.validate(moment('2014-11-03T07:45:41.237Z')).should.eql('2014-11-03T07:45:41.237Z');
shouldThrowError(moment.invalid());
});

it('validate() - required', function(){
var type = new SchemaTypeMoment('test', {required: true});
type.validate().should.have.property('message', '`test` is required!');
});

it('match()', function(){
type.match(moment(1e8), moment(1e8)).should.be.true;
