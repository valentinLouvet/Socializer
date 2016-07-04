var app = angular.module('mainApp', ['ngRoute', 'ngCookies']).run(function ($cookies, $rootScope) {

    $rootScope.authenticated = $cookies.get('authenticated');
    $rootScope.current_user = $cookies.get('current_user');

    $rootScope.signout = function () {
        $rootScope.authenticated = false;
        $cookies.put('authenticated', '');
        $rootScope.current_user = '';
        $cookies.put('current_user', '');
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
        })
        .when("/search", {
            templateUrl: 'userSearch.html'
        });
});


app.controller('mainController', function ($scope, postService, $rootScope, $cookies) {
    $scope.posts = [];
    $scope.newPost = {created_by: '', text: '', created_at: ''};
    postService.getAll().success(function (data) {
        console.log("getting data");
        $scope.posts = data;
    });

    $scope.post = function () {

        if ($cookies.get('authenticated')) {
            $scope.newPost.created_at = Date.now();
            $scope.newPost.created_by = $rootScope.current_user;
            postService.create($scope.newPost).success(function (data) {
                $scope.posts.push(data);

            });
            console.log("posted at : " + Date.now());
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        }
        else {
            alert("you need to be authenticated to post");
        }


    };
    $scope.delete = function (post) {
        if ($cookies.get('current_user') == post.created_by) {
            postService.delete(post).success(function () {
                postService.getAll().success(function (data) {
                    $scope.posts = data;
                });
            })
        }
        else {
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
app.factory('userService', function ($http) {
    var factory = {};
    factory.create = function (user) {
        return $http.post("/auth/users", user);
    };
    factory.getUser = function (user) {
        return $http.get("/auth/users/" + user.username);
    };
    return factory;
});

app.controller('authController', function ($scope, userService, $rootScope, $location, $cookies) {
    $scope.user = {username: '', password: ''};
    $scope.login = function () {
        userService.getUser($scope.user).success(function (data) {
            if (data && data.password == $scope.user.password) {

                $rootScope.authenticated = true;
                $cookies.put('authenticated', true);
                $rootScope.current_user = data.username;
                $cookies.put('current_user', data.username);
                console.log('signed in');
                $location.path('/');
            }
            else {
                $scope.error_message = "invalid username or password"
            }


        });

    };

    $scope.register = function () {
        userService.getUser($scope.user).success(function (data) {
            if (!data) {
                userService.create($scope.user).success(function (data) {
                    $rootScope.authenticated = true;
                    $cookies.put('authenticated', true);
                    $rootScope.current_user = data.username;
                    $cookies.put('current_user', data.username);
                    console.log('registration successgul');
                    $location.path('/');
                });
            }
            else {
                $scope.error_message = "username already exist"
            }
        });


    };

});





