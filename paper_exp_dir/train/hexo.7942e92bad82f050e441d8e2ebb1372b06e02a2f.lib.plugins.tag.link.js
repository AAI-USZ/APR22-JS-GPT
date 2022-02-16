var util = require('hexo-util');
var htmlTag = util.htmlTag;

var rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;



function linkTag(args, content){
var url = '';
var text = [];
var external = false;
var title = '';
var item = '';


for (var i = 0, len = args.length; i < len; i++){
item = args[i];

if (rUrl.test(item)){
url = item;
break;
} else {
text.push(item);
}
}


args = args.slice(i + 1);



if (args.length){
var shift = args[0];

if (shift === 'true' || shift === 'false'){
external = shift === 'true' ? true : false;
args.shift();
}

title = args.join(' ');
}

var attrs = {
href: url,
title: title,
target: external ? '_blank' : ''
};

return htmlTag('a', attrs, text.join(' '));
}

module.exports = linkTag;
