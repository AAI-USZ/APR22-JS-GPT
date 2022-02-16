it('should not guess the name from the path if the name was specified', function () {
var resolver = new GitFsResolver(testPackage, { name: 'foo' });
expect(resolver.getName()).to.equal('foo');
