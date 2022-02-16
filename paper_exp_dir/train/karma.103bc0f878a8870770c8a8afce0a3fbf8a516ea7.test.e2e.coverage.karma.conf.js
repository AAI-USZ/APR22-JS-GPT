frameworks = ['jasmine'];

files = [
'lib/*.js',
'test/*.js'
];

autoWatch = true;

browsers = ['Chrome']

reporters = ['progress', 'coverage'];

preprocessors = {
'**/coverage/lib/*.js': 'coverage'
};




