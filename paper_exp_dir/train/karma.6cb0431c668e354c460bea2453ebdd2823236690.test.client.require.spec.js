describe('adapter requirejs', function() {
var load, originalLoadSpy;

beforeEach(function() {
var files = {
'/base/some/file.js': '12345'
};

originalLoadSpy = jasmine.createSpy('requirejs.load');
load = createPatchedLoad(files, originalLoadSpy);
});

