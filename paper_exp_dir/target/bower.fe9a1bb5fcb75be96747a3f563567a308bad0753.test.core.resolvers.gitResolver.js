it('should resolve "*" to the latest version if a repository has valid semver tags, not ignoring pre-releases if they are the only versions', function (next) {
.then(function (resolution) {
expect(resolution).to.eql({
