angular.module('ideaTron', ['ngRoute', 'ngAnimate', 'firebase'])
    .constant('FIREBASE_URL', 'https://burning-heat-343.firebaseio.com/ideas')
    .factory('firebaseReference', function(FIREBASE_URL) {
        return new Firebase(FIREBASE_URL);
    })
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './pages/main.html',
                    controller: 'mainCtrl'
                })
                .when('/ideas', {
                    templateUrl: './pages/ideas.html',
                    controller: 'ideaCtrl'
                })
        }
    ])
    .controller('mainCtrl', ['$rootScope', '$scope', '$location', 'firebaseReference',
        function($rootScope, $scope, $location, firebaseReference) {
            var ref = firebaseReference;
            var authData = ref.getAuth();
            console.log(authData);
            if (authData) {
                $scope.userId = authData.uid;
                var userId = $scope.userId;
                var userProd = authData.provider;
                if (userProd.indexOf("anonymous") < 0) {
                    $scope.loggedIn = true;
                } else {
                    $scope.loggedIn = false;
                }

            }
            $scope.showSideNav = function() {
                $('.button-collapse').sideNav({
                    closeOnClick: true
                });
            }
            $scope.login = function() {
                ref.authWithOAuthPopup("github", function(error, authData) {
                    if (error) {
                        if (error.code === "TRANSPORT_UNAVAILABLE") {
                            ref.authWithOAuthRedirect("github", function(error) {
                                console.log("Login Failed!", error);
                            });
                        } else {
                            console.log("Login Failed!", error);
                        }
                    } else {
                        $rootScope.userId = authData.uid;
                        $rootScope.loggedIn = true;
                        if ($location.path('/about')) {
                            $location.path('/ideas');
                            $scope.$apply();
                        } else {
                            $location.path('/ideas');
                            $scope.$apply();
                        }
                        // $scope.$apply();
                        console.log("Authenticated successfully with payload:", authData);

                    }
                });
            }
            $scope.loginAnon = function() {
                ref.authAnonymously(function(error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        $rootScope.userId = authData.uid;
                        $rootScope.loggedIn = false;
                        console.log("Authenticated successfully with payload:", authData);
                        $location.path('/ideas');
                        $scope.$apply();
                    }
                });
            }
            $scope.logOut = function() {
                var userRef = ref.child(userId);
                userRef.unauth();
                $rootScope.loggedIn = false;
                $location.path('/');
                $scope.$apply();
            }
        }
    ])
    .controller('ideaCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', 'firebaseReference',
        function($rootScope, $scope, $http, $location, $window, firebaseReference) {
            $scope.numbers = [1, 2, 3];
            $scope.loggedIn = false;
            var ref = firebaseReference;
            var authData = ref.getAuth();
            if (authData) {
                $scope.userId = authData.uid;
                var userId = $scope.userId;
                var userProd = authData.provider;
                if (userProd.indexOf("anonymous") < 0) {
                    $scope.loggedIn = true;
                }
            }
            $scope.showSideNav = function() {
                $('.button-collapse').sideNav({
                    closeOnClick: true
                });
            }
            //create factory for calling/showing previous ideas
            var userRef = ref.child(userId);
            if (userProd.indexOf("anonymous") == -1) {
                userRef.limitToLast(5).once("value", function(snapshot) {
                    if (snapshot.val() == null) {
                        $scope.limitedIdeas = 0;
                    } else {
                        $scope.prevIdeas = snapshot.val();
                        $scope.limitedIdeas = Object.keys($scope.prevIdeas).length;
                        $scope.$apply();
                    }
                })
            }
            $scope.showMore = function() {
                $scope.limitedIdeas = Object.keys($scope.prevIdeas).length;
                var numb = $scope.limitedIdeas;
                console.log(numb);
                userRef.limitToLast(numb + 5).once("value", function(snapshot) {
                    $scope.prevIdeas = snapshot.val();
                    $scope.$apply();
                })
            }
            $scope.clearData = function() {
                userRef.remove();
                // $scope.$apply();
                userRef.once("value", function(snapshot) {
                    if (snapshot.val() == null) {
                        $scope.limitedIdeas = 0;
                    }
                    // $scope.$apply();
                })
            }
            $scope.deleteMe = function(o) {
                userRef.child(o).remove();
                userRef.limitToLast(5).on("value", function(snapshot) {
                    $scope.prevIdeas = snapshot.val();
                    $scope.limitedIdeas = Object.keys($scope.prevIdeas).length;
                    //$scope.$apply();
                })
            }
            $scope.selectService = function() {
                $http.get("http://apis.io/api/search?q=all&limit=234").success(function(data) {
                    var random = data;
                    $scope.ideas = [];
                    for (var i = 0; i < $scope.serviceNumber; i++) {
                        var num = Math.floor(Math.random() * 234);
                        $scope.ideas.push(random.data[num]);
                    }
                    // clean up returned data
                    for (var j = 0; j < $scope.ideas.length; j++) {
                        if ($scope.ideas[j].tags instanceof Array) {
                            var len = $scope.ideas[j].tags.length;
                            for (var k = 0; k < len - 1; k++) {
                                $scope.ideas[j].tags[k] += ",";
                            }
                        } else {
                            var tmp = $scope.ideas[j].tags.split(", ");
                            $scope.ideas[j].tags = tmp;
                            var len = $scope.ideas[j].tags.length;
                            for (var k = 0; k < len - 1; k++) {
                                $scope.ideas[j].tags[k] += ",";
                            }
                        }
                    }
                    userRef.push($scope.ideas);
                    userRef.limitToLast(5).on("value", function(snapshot) {
                        console.log(snapshot.val());
                        $scope.prevIdeas = snapshot.val();
                        $scope.limitedIdeas = Object.keys($scope.prevIdeas).length;
                        // $scope.$apply();
                    })
                })
            }
            //create factory for login
            $scope.login = function() {
                ref.authWithOAuthPopup("github", function(error, authData) {
                    if (error) {
                        if (error.code === "TRANSPORT_UNAVAILABLE") {
                            ref.authWithOAuthRedirect("github", function(error) {
                                console.log("Login Failed!", error);
                            });
                        } else {
                            console.log("Login Failed!", error);
                        }
                    } else {
                        $rootScope.userId = authData.uid;
                        $rootScope.loggedIn = true;
                        $window.location.reload('#/ideas');
                        //$scope.$apply();
                        console.log("Authenticated successfully with payload:", authData);
                    }
                });
            }
            $scope.logOut = function() {
                userRef.unauth();
                $rootScope.loggedIn = false;
                $location.path('/');
            }
            $scope.classy = function(idea, idx) {
                if (idea.length == 1) {
                    return "s4 offset-s4"
                } else if (idea.length == 2) {
                    if (idx == 0) {
                        return "s4 offset-s2"
                    } else {
                        return "s4"
                    }
                } else {
                    return "s4"
                }
            }

        }
    ])