var extend = require('../extend'),
format = require('util').format;

var regex = {
url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/,
meta: /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/
};

var img = function(args, content){
var classes = [],
src = '';

for (var i=0, len=args.length; i<len; i++){
var item = args[i];

if (!item.match(regex.url)){
if (item.substr(0, 1) === '/'){
src = item;
args = args.slice(i + 1);
break;
} else {
classes.push(item);
}
} else {
src = item;
args = args.slice(i + 1);
break;
