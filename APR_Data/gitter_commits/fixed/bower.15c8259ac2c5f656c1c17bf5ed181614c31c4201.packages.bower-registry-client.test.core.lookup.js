var lookup = require('../../lib/lookup'),
    expect = require('chai').expect;

describe('lookup module', function () {

    describe('requiring the lookup module', function () {

        it('should expose a lookup method', function () {
            expect(typeof lookup === 'function').to.be.ok;
        });

        it('should expose a initCache method', function () {
            expect(lookup.initCache).to.be.ok;
            expect(typeof lookup.initCache === 'function').to.be.ok;
        });

        it('should expose a clearCache method', function () {
            expect(lookup.clearCache).to.be.ok;
            expect(typeof lookup.clearCache === 'function').to.be.ok;
        });

        it('should expose a ClearRuntimeCache method', function () {
            expect(lookup.clearCache).to.be.ok;
            expect(typeof lookup.clearCache === 'function').to.be.ok;
        });

    });

});