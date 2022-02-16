var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');
var mm = require('minimatch');
var exec = require('child_process').exec;

var helper = require('./helper');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var StateMachine = require('./init/state_machine');

var JS_TPL_PATH = __dirname + '/../config.tpl.js';
var COFFEE_TPL_PATH = __dirname + '/../config.tpl.coffee';






var COLORS_ON = {
END: '\x1B[39m',
NYAN: '\x1B[36m',
GREEN: '\x1B[32m',
BOLD: '\x1B[1m',
bold: function(str) {
return this.BOLD + str + '\x1B[22m';
},
green: function(str) {
return this.GREEN + str + this.END;
}
};


var colors = COLORS_ON;

var COLORS_OFF = {
END: '',
NYAN: '',
GREEN: '',
BOLD: '',
bold: function(str) {
return str;
},
green: function(str) {
return str;
}
};

var logQueue = [];

var printLogQueue = function() {
while (logQueue.length) {
logQueue.shift()();
}
};

var NODE_MODULES_DIR = path.resolve(__dirname, '../..');



if (!/node_modules$/.test(NODE_MODULES_DIR)) {
NODE_MODULES_DIR = path.resolve('node_modules');
}

var installPackage = function(pkgName) {

try {
require(NODE_MODULES_DIR + '/' + pkgName);
return;
} catch (e) {}

log.debug('Missing plugin "%s". Installing...', pkgName);

var options = {
cwd: path.resolve(NODE_MODULES_DIR, '..')
};

exec('npm install ' + pkgName + ' --save-dev', options, function(err, stdout, stderr) {


logQueue.push(function() {
if (!err) {
log.debug('%s successfully installed.', pkgName);
} else if (/is not in the npm registry/.test(stderr)) {
log.warn('Failed to install "%s". It is not in the NPM registry!\n' +
'  Please install it manually.', pkgName);
} else if (/Error: EACCES/.test(stderr)) {
log.warn('Failed to install "%s". No permissions to write in %s!\n' +
'  Please install it manually.', pkgName, options.cwd);
} else {
log.warn('Failed to install "%s"\n  Please install it manually.', pkgName);
}
});
});
};

var validatePattern = function(pattern) {
if (!glob.sync(pattern).length) {
log.warn('There is no file matching this pattern.\n');
}
};


var validateBrowser = function(name) {

installPackage('karma-' + name.toLowerCase().replace('canary', '') + '-launcher');
};

var validateFramework = function(name) {
installPackage('karma-' + name);
};

var validateRequireJs = function(useRequire) {
if (useRequire) {
validateFramework('requirejs');
}
};


var questions = [{
id: 'framework',
question: 'Which testing framework do you want to use ?',
hint: 'Press tab to list possible options. Enter to move to the next question.',
options: ['jasmine', 'mocha', 'qunit', 'nodeunit', 'nunit', ''],
validate: validateFramework
}, {
id: 'requirejs',
question: 'Do you want to use Require.js ?',
hint: 'This will add Require.js plugin.\n' +
'Press tab to list possible options. Enter to move to the next question.',
options: ['no', 'yes'],
validate: validateRequireJs,
boolean: true
}, {
id: 'browsers',
question: 'Do you want to capture any browsers automatically ?',
hint: 'Press tab to list possible options. Enter empty string to move to the next question.',
options: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS', 'Opera', 'IE', ''],
validate: validateBrowser,
multiple: true
}, {
id: 'files',
question: 'What is the location of your source and test files ?',
hint: 'You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'exclude',
question: 'Should any of the files included by the previous patterns be excluded ?',
hint: 'You can use glob patterns, eg. "**/*.swp".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'includedFiles',
question: 'Which files do you want to include with <script> tag ?',
hint: 'This should be a script that bootstraps your test by configuring Require.js and ' +
'kicking __karma__.start(), probably your test-main.js file.\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern,
condition: function(answers) {return answers.requirejs;}
}, {
id: 'autoWatch',
question: 'Do you want Karma to watch all the files and run the tests on change ?',
hint: 'Press tab to list possible options.',
options: ['yes', 'no'],
boolean: true
}];






var quote = function(value) {
return '\'' + value + '\'';
};

var quoteNonIncludedPattern = function(value) {
return util.format('{pattern: %s, included: false}', quote(value));
};


var formatFiles = function(files) {
return files.join(',\n      ');
};


var pad = function(str, pad) {
return str.replace(/\n/g, '\n' + pad);
};


var formatPreprocessors = function(preprocessors) {
var lines = [];
Object.keys(preprocessors).forEach(function(pattern) {
lines.push('  ' + quote(pattern) + ': [' + preprocessors[pattern].map(quote).join(', ') + ']');
});

return pad('{\n' + lines.join(',\n') + '\n}', '    ');
};


var getBasePath = function(configFilePath, cwd) {
var configParts = path.dirname(configFilePath).split(path.sep);
var cwdParts = cwd.split(path.sep);
var base = [];

while (configParts.length && configParts[0] === cwdParts[0]) {
configParts.shift();
cwdParts.shift();
}

while (configParts.length) {
var part = configParts.shift();
if (part === '..') {
base.unshift(cwdParts.pop());
} else if (part !== '.') {
base.unshift('..');
}
}

return base.join(path.sep);
};


var getReplacementsFromAnswers = function(answers, basePath) {
var files = answers.files.map(answers.includedFiles ? quoteNonIncludedPattern : quote);

if (answers.includedFiles) {
files = answers.includedFiles.map(quote).concat(files);
}

var frameworks = [];

if (answers.framework) {
frameworks.push(answers.framework);
}

if (answers.requirejs) {
frameworks.push('requirejs');
}

var allPatterns = answers.files.concat(answers.includedFiles || []);
var preprocessors = {};
if (allPatterns.some(function(pattern) {
return mm(pattern, '**/*.coffee');
})) {
installPackage('karma-coffee-preprocessor');
preprocessors['**/*.coffee'] = ['coffee'];
}

return {
DATE: new Date(),
BASE_PATH: basePath,
FRAMEWORKS: frameworks.map(quote).join(', '),
FILES: formatFiles(files),
EXCLUDE: answers.exclude ? formatFiles(answers.exclude.map(quote)) : '',
AUTO_WATCH: answers.autoWatch ? 'true' : 'false',
BROWSERS: answers.browsers.map(quote).join(', '),
PREPROCESSORS: formatPreprocessors(preprocessors)
};
};

var COFFEE_REGEXP = /\.coffee$/;
var isCoffeeFile = function(filename) {
return COFFEE_REGEXP.test(filename);
};


exports.init = function(config) {
var useColors = true;
var logLevel = constant.LOG_INFO;

if (helper.isDefined(config.colors)) {
colors = config.colors ? COLORS_ON : COLORS_OFF;
useColors = config.colors;
}

if (helper.isDefined(config.logLevel)) {
logLevel = config.logLevel;
}

logger.setup(logLevel, useColors);



process.stdin.on('keypress', function(s, key) {
sm.onKeypress(key);
});

var rli = readline.createInterface(process.stdin, process.stdout);
var sm = new StateMachine(rli, colors);

rli.on('line', sm.onLine.bind(sm));


rli.on('SIGINT', function() {
sm.kill();
process.exit(0);
});

sm.on('next_question', printLogQueue);

sm.process(questions, function(answers) {
var cwd = process.cwd();
var configFile = config.configFile || 'karma.conf.js';
var templateFile = isCoffeeFile(configFile) ? COFFEE_TPL_PATH : JS_TPL_PATH;
var replacements = getReplacementsFromAnswers(answers, getBasePath(configFile, process.cwd()));
var content = fs.readFileSync(templateFile).toString().replace(/%(.*)%/g, function(a, key) {
return replacements[key];
});

var configFilePath = path.resolve(cwd, configFile);
fs.writeFileSync(configFilePath, content);
rli.write(colors.green('\nConfig file generated at "' + configFilePath + '".\n\n'));
rli.close();
});
};
