const sinon = require('sinon')
const chai = require('chai')
const logger = require('../../lib/logger')
const recording = require('log4js/lib/appenders/recording')


global.expect = chai.expect
global.should = chai.should()
global.sinon = sinon


chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))
chai.use(require('chai-subset'))

