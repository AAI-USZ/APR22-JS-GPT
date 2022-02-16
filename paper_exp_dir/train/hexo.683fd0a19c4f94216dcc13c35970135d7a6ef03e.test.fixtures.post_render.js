'use strict';

var util = require('hexo-util');

var code = [
'if tired && night:',
'  sleep()'
].join('\n');

var content = [
'# Title',
'``` python',
code,
'```',
'some content',
