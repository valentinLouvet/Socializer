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
            templateUrl: 'userSearch.html',
            controller: 'searchController'
        });
});










