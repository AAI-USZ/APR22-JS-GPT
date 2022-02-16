


global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;
global.should = chai.should();

global.chaiAsPromised = require('chai-as-promised');
global.sinonChai = require('sinon-chai');

global.timer = require('timer-shim');

chai.use(sinonChai);
chai.use(chaiAsPromised);


sinon.stub(console, 'log');

sinon.stub(timer, 'setTimeout').callsArg(0);
