var _ = require('underscore');

var Collection = function(arr){
if (arr){
var length = this.length = arr.length;

for (var i=0; i<length; i++){
this[i] = arr[i];
}
} else {
