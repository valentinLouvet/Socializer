app.controller('searchController', function($scope, $rootScope, searchService){
    $scope.userSearched = [];
    $scope.search = '' ;
    $scope.searching = function(){
        searchService.get($scope.search).success(function(data){
            $scope.userSearched = data;
            for(var i = 0; i<$scope.userSearched.length; i++){
                if($scope.userSearched[i].username == $rootScope.current_user ){
                    $scope.userSearched.splice(i,1);
                }
            }
        });
    };





    
});
app.factory('searchService', function($http){
    var factory = {};
    factory.get = function(userSearched){
        return $http.get("/auth/search/" + userSearched);
    };
    return factory;
});