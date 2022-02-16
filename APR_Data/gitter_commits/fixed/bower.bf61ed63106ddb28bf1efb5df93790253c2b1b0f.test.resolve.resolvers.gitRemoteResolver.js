var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var GitRemoteResolver = require('../../../lib/resolve/resolvers/GitRemoteResolver');

describe('GitRemoteResolver', function () {
    var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

    function cleanInternalResolverCache() {
        delete GitRemoteResolver._versions;
        delete GitRemoteResolver._tags;
        delete GitRemoteResolver._branches;
        delete GitRemoteResolver._refs;
    }

    describe('.constructor', function () {
        it('should guess the name from the path', function () {
            var resolver = new GitRemoteResolver('file://' + testPackage);

            expect(resolver.getName()).to.equal('github-test-package');

            resolver = new GitRemoteResolver('git://github.com/twitter/bower.git');
            expect(resolver.getName()).to.equal('bower');

            resolver = new GitRemoteResolver('git://github.com/twitter/bower');
            expect(resolver.getName()).to.equal('bower');

            resolver = new GitRemoteResolver('git://github.com');
            expect(resolver.getName()).to.equal('github.com');
        });
    });

    describe('.resolve', function () {
        it('should checkout correctly if resolution is a branch', function (next) {
            var resolver = new GitRemoteResolver('file://' + testPackage, { target: 'some-branch' });

            resolver.resolve()
            .then(function (dir) {
                expect(dir).to.be.a('string');

                var files = fs.readdirSync(dir),
                    fooContents;

                expect(files).to.contain('foo');
                expect(files).to.contain('baz');
                expect(files).to.contain('baz');

                fooContents = fs.readFileSync(path.join(dir, 'foo')).toString();
                expect(fooContents).to.equal('foo foo');

                next();
            })
            .done();
        });

        it('should checkout correctly if resolution is a tag', function (next) {
            var resolver = new GitRemoteResolver('file://' + testPackage, { target: '~0.0.1' });

            resolver.resolve()
            .then(function (dir) {
                expect(dir).to.be.a('string');

                var files = fs.readdirSync(dir);

                expect(files).to.contain('foo');
                expect(files).to.contain('bar');
                expect(files).to.not.contain('baz');

                next();
            })
            .done();
        });

        it('should checkout correctly if resolution is a commit', function (next) {
            var resolver = new GitRemoteResolver('file://' + testPackage, { target: '7339c38f5874129504b83650fbb2d850394573e9' });

            resolver.resolve()
            .then(function (dir) {
                expect(dir).to.be.a('string');

                var files = fs.readdirSync(dir);

                expect(files).to.not.contain('foo');
                expect(files).to.not.contain('bar');
                expect(files).to.not.contain('baz');
                expect(files).to.contain('README.md');
                next();
            })
            .done();
        });
    });

    describe('#fetchRefs', function () {
        afterEach(cleanInternalResolverCache);

        it('should resolve to the references of the remote repository', function (next) {
            GitRemoteResolver.fetchRefs('file://' + testPackage)
            .then(function (refs) {
                expect(refs).to.eql([
                    'f99467d1069892ea639b6a3d2afdbff6ac62f44e refs/heads/master',
                    '8b03dbbe20e0bc4f1fae2811ea0063121eb1b155 refs/heads/some-branch',
                    '122ac45fd22671a23cf77055a32d06d5a7baedd0 refs/tags/0.0.1',
                    '19b3a35cc7fded9a8a60d5b8fc0d18eb4940c476 refs/tags/0.0.1^{}',
                    '34dd75a11e686be862844996392e96e9457c7467 refs/tags/0.0.2',
                    'ddc6ea571c49c1ab8bb213fda18efdfe2bc8dd00 refs/tags/0.0.2^{}',
                    '92327598500f115d09ab14f16cde23718fc87658 refs/tags/0.1.0',
                    'b273e321ebc69381be2780668a22e28bec9e2b07 refs/tags/0.1.0^{}',
                    '192bc846a342eb8ae62bb1a54d1394959e6fcd92 refs/tags/0.1.1',
                    'f99467d1069892ea639b6a3d2afdbff6ac62f44e refs/tags/0.1.1^{}'
                ]);
                next();
            })
            .done();
        });

        it('should cache the results', function (next) {
            var source = 'file://' + testPackage;

            GitRemoteResolver.fetchRefs(source)
            .then(function () {
                expect(GitRemoteResolver._refs).to.be.an('object');
                expect(GitRemoteResolver._refs[source]).to.be.an('array');

                // Manipulate the cache and check if it resolves for the cached ones
                GitRemoteResolver._refs[source].splice(0, 1);

                // Check if it resolver to the same array
                return GitRemoteResolver.fetchRefs('file://' + testPackage);
            })
            .then(function (refs) {
                expect(refs).to.eql([
                    '8b03dbbe20e0bc4f1fae2811ea0063121eb1b155 refs/heads/some-branch',
                    '122ac45fd22671a23cf77055a32d06d5a7baedd0 refs/tags/0.0.1',
                    '19b3a35cc7fded9a8a60d5b8fc0d18eb4940c476 refs/tags/0.0.1^{}',
                    '34dd75a11e686be862844996392e96e9457c7467 refs/tags/0.0.2',
                    'ddc6ea571c49c1ab8bb213fda18efdfe2bc8dd00 refs/tags/0.0.2^{}',
                    '92327598500f115d09ab14f16cde23718fc87658 refs/tags/0.1.0',
                    'b273e321ebc69381be2780668a22e28bec9e2b07 refs/tags/0.1.0^{}',
                    '192bc846a342eb8ae62bb1a54d1394959e6fcd92 refs/tags/0.1.1',
                    'f99467d1069892ea639b6a3d2afdbff6ac62f44e refs/tags/0.1.1^{}'
                ]);
                next();
            })
            .done();
        });
    });
});