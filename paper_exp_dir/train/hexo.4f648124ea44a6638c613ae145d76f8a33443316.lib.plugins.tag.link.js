var util = require('hexo-util');
var htmlTag = util.html_tag;

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
