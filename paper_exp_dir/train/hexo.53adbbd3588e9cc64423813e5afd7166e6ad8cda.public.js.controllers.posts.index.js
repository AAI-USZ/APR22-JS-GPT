define(function(require, exports, module){
return ['$scope', '$http', '$state', 'sharedData', 'apiBaseUrl', 'templateBaseUrl',
function($scope, $http, $state, sharedData, apiBaseUrl, templateBaseUrl){

sharedData.set('title', 'Posts | Hexo');

$scope.modal = {
options: {
backdropFade: true,
dialogFade: true
},
show: false,
open: function(){
$scope.modal.show = true;
