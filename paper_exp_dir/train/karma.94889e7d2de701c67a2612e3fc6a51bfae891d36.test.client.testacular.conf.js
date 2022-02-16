








basePath = '../..';


files = [
JASMINE,
JASMINE_ADAPTER,
'test/client/mocks.js',
'static/testacular.src.js',
'test/client/mocks/ObjectModel.js',
'adapter/*.src.js',
'test/client/*.spec.js'
];


exclude = [
];




reporters = ['progress', 'junit'];

junitReporter = {

outputFile: 'test-results.xml'
};



port = 9876;
