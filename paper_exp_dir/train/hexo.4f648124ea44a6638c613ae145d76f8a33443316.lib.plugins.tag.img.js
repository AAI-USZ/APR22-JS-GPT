var util = require('hexo-util');
var htmlTag = util.html_tag;

var rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
var rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;



function imgTag(args, content){
var classes = [];
var meta = '';
var width;
var height;
var title;
var alt;
var src;
var item = '';


for (var i = 0, len = args.length; i < len; i++){
