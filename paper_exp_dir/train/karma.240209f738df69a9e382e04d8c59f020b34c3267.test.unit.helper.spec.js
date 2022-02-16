'use strict'

const path = require('path')

describe('helper', () => {
const helper = require('../../lib/helper')

describe('browserFullNameToShort', () => {

const expecting = (name) => expect(helper.browserFullNameToShort(name))

it('should parse iOS', () => {
expecting(
'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 ' +
'(KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
)
.to.be.equal('Mobile Safari 6.0.0 (iOS 6.0.0)')
})

it('should parse Linux', () => {
expecting(
'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.19) Gecko/20081216 ' +
'Ubuntu/8.04 (hardy) Firefox/2.0.0.19'
)
.to.be.equal('Firefox 2.0.0 (Ubuntu 8.04.0)')
})

it('should degrade gracefully when OS not recognized', () => {
expecting(
'Mozilla/5.0 (X11; U; FreeBSD; i386; en-US; rv:1.7) Gecko/20081216 ' +
'Firefox/2.0.0.19'
).to.be.equal('Firefox 2.0.0 (FreeBSD 0.0.0)')
})

it('should parse Chrome', () => {
expecting(
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 ' +
'(KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
)
.to.be.equal('Chrome 16.0.912 (Mac OS X 10.6.8)')

expecting(
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.15 ' +
'(KHTML, like Gecko) Chrome/18.0.985.0 Safari/535.15'
)
.to.be.equal('Chrome 18.0.985 (Mac OS X 10.6.8)')
})

it('should parse Firefox', () => {
expecting(
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:7.0.1) Gecko/20100101 ' +
'Firefox/7.0.1'
)
.to.be.equal('Firefox 7.0.1 (Mac OS X 10.6.0)')
})

it('should parse Opera', () => {
expecting(
'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.9.168 ' +
'Version/11.52'
)
.to.be.equal('Opera 11.52.0 (Mac OS X 10.6.8)')
})

it('should parse Safari', () => {
expecting(
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.52.7 ' +
'(KHTML, like Gecko) Version/5.1.2 Safari/534.52.7'
)
.to.be.equal('Safari 5.1.2 (Mac OS X 10.6.8)')
})

it('should parse IE7', () => {
expecting(
'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; SLCC1; ' +
'.NET CLR 2.0.50727; .NET4.0C; .NET4.0E)'
)
.to.be.equal('IE 7.0.0 (Windows Vista.0.0)')
})

it('should parse IE8', () => {
expecting(
'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; ' +
'SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3)"'
)
.to.be.equal('IE 8.0.0 (Windows 7.0.0)')
})

it('should parse IE9', () => {
expecting(
'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; ' +
'.NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)'
)
.to.be.equal('IE 9.0.0 (Windows 7.0.0)')
})

it('should parse IE10', () => {
expecting(
'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; ' +
'.NET4.0E; .NET4.0C)'
)
.to.be.equal('IE 10.0.0 (Windows 8.0.0)')
})

it('should parse PhantomJS', () => {
expecting(
'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) ' +
'PhantomJS/1.6.0 Safari/534.34'
)
.to.be.equal('PhantomJS 1.6.0 (Mac OS X 0.0.0)')
})


it('should parse old Android Browser', () => {
expecting(
'Mozilla/5.0 (Linux; U; Android 4.2; en-us; sdk Build/JB_MR1) ' +
'AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
)
.to.be.equal('Android 4.2.0 (Android 4.2.0)')
})

it('should parse Headless Chrome', () => {
expecting(
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
'HeadlessChrome/70.0.3538.77 Safari/537.36'
)
