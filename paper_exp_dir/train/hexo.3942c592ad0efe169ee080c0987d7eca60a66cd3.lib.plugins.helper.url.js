var url = require('url');

var trimArr = function(arr){
var start = 0,
length = arr.length,
end = length - 1;

for (; start < length;  start++){
if (arr[start] !== '') break;
}
