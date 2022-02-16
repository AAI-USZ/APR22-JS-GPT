describe('middleware.strip_host', function () {
const stripHost = require('../../../lib/middleware/strip_host').stripHost

it('should strip request with IP number', function () {
const normalizedUrl = stripHost('http://192.12.31.100/base/a.js?123345')
expect(normalizedUrl).to.equal('/base/a.js?123345')
})

it('should strip request with absoluteURI', function () {
const normalizedUrl = stripHost('http://localhost/base/a.js?123345')
expect(normalizedUrl).to.equal('/base/a.js?123345')
