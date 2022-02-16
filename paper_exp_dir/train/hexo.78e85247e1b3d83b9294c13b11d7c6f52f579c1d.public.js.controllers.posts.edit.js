define(function(require, exports, module){
var $ = require('lib/jquery');

return ['$scope', '$http', '$state', '$stateParams', '$filter', 'apiBaseUrl', 'templateBaseUrl',
function($scope, $http, $state, $stateParams, $filter, apiBaseUrl, templateBaseUrl){

var id = $stateParams.id,
editor;

$scope.$parent.selected = id;

$scope.save = function(){
var post = $scope.post;

$scope.status = 'Saving...';

$http.put(apiBaseUrl + 'posts/' + id, {content: post.content})
.success(function(data){
var parent = $filter('getById')($scope.$parent.posts, id);
