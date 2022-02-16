function trimArr(arr){
var start = 0;
var length = arr.length;
var end = length - 1;

for (; start < length;  start++){
if (arr[start] !== '') break;
}

for (; end > start; end--){
