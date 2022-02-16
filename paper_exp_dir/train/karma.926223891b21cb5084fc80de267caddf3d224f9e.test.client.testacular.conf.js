








basePath = '../..';

frameworks = ['jasmine'];


files = [
'test/client/mocks.js',
'static/testacular.src.js',
'test/client/*.spec.js'
];


exclude = [];




reporters = ['progress', 'junit'];

junitReporter = {

outputFile: 'test-results.xml'
};
