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
