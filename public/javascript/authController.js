
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