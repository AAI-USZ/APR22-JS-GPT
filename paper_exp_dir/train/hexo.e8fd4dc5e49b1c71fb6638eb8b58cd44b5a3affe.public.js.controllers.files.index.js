define(function(require, exports, module){
return ['$scope', '$http', '$stateParams', 'sharedData', function($scope, $http, $stateParams, sharedData){
sharedData.set('menu', 'files');
sharedData.set('title', 'Files | Hexo');
}]
});
