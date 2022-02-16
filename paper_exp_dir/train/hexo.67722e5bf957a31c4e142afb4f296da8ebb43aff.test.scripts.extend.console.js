var should = require('chai').should();

describe('Console', () => {
var Console = require('../../../lib/extend/console');

it('register()', () => {
var c = new Console();


try {
c.register();
