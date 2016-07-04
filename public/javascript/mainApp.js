var app = angular.module('mainApp', ['ngRoute']).run(function($rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.signout = function(){
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };

});
app.config(function ($routeProvider) {
    $routeProvider

        .when("/", {
            templateUrl: 'main.html',
            controller: 'mainController'

        })
        .when("/register", {
            templateUrl: 'register.html',
            controller: 'authController'
        })
        .when("/login", {
            templateUrl: 'login.html',
            controller: 'authController'
        });

});

app.controller('mainController', function ($scope, postService, $rootScope) {
    $scope.posts = [];
    $scope.newPost = {created_by: '', text: '', created_at: ''};
    postService.getAll().success(function (data) {
        console.log("getting data");
        $scope.posts = data;
    });

    $scope.post = function () {

        if ($rootScope.authenticated) {
            $scope.newPost.created_at = Date.now();
            $scope.newPost.created_by = $rootScope.current_user;
            postService.create($scope.newPost).success(function (data) {
                $scope.posts.push(data);

            });
            console.log("posted at : " + Date.now());
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        }
        else{
            alert("you need to be authenticated to post");
        }


    };
    $scope.delete = function (post) {
        if($rootScope.current_user == post.created_by){
            postService.delete(post).success(function () {
                postService.getAll().success(function (data) {
                    $scope.posts = data;
                });
            })
        }
        else{
            alert("you can only delete your own post");
        }

    };


});

app.factory('postService', function ($http) {
    var baseUrl = "/api/posts";
    var factory = {};
    factory.getAll = function () {
        return $http.get(baseUrl);
    };
    factory.create = function (post) {
        return $http.post(baseUrl, post);

    };
    factory.delete = function (post) {
        return $http.delete("/api/posts/" + post._id);
    };
    return factory;


});
app.factory('userService', function($http){
    var factory = {};
    factory.create = function(user) {
        return $http.post("/auth/users", user);
    };
    factory.getUser = function(user) {
        return $http.get("/auth/users/" + user.username);
    };
    return factory;
});

app.controller('authController', function ($scope,userService,$rootScope,$location) {
    $scope.user = {username: '', password: ''};
    $scope.login = function () {
        userService.getUser($scope.user).success(function(data){
           if(data && data.password == $scope.user.password) {
               $rootScope.authenticated = true;
               $rootScope.current_user = data.username;
               console.log('signed in');
               $location.path('/');
           }


        });

    };

    $scope.register = function () {
        userService.getUser($scope.user).success(function(data){
            if(!data){
                userService.create($scope.user).success(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.username;
                    console.log('registration successgul');
                    $location.path('/');
                });
            }
        });

    };

});





