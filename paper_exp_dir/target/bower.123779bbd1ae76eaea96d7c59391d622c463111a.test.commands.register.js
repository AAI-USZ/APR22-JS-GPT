it('errors if trying to register private package', function () {
package.prepare({ 'bower.json': { private: true } });

