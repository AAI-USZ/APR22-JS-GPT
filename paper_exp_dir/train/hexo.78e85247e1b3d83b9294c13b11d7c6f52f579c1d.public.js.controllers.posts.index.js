define(function(require, exports, module){
var $ = require('lib/jquery');

return ['$scope', '$http', '$state', 'sharedData', 'apiBaseUrl', 'templateBaseUrl',
function($scope, $http, $state, sharedData, apiBaseUrl, templateBaseUrl){

sharedData.set('menu', 'posts');
sharedData.set('title', 'Posts | Hexo');

$scope.modal = {
options: {
backdropFade: true,
dialogFade: true
},
