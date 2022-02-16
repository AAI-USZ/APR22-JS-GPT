var extend = require('../../extend'),
_ = require('lodash');

var result = [
'hexo: ' + hexo.version
];

_.each(process.versions, function(val, key){
result.push(key + ': ' + val);
});

console.log(result.join('\n'));
callback();
});
