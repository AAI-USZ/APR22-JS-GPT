var resolver;
resolver = new GitRemoteResolver('file://' + testPackage);
expect(resolver.getName()).to.equal('github-test-package');
