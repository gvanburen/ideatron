angular.module('ideaTron',['ngRoute','ngAnimate','firebase'])
	.constant('FIREBASE_URL', 'https://burning-heat-343.firebaseio.com/ideas')
	.factory('firebaseReference', function(FIREBASE_URL){
		return new Firebase( FIREBASE_URL );
	})
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainCtrl'
		})
		// .when('/signup',{
		// 	templateUrl: 'signup.html',
		// 	controller: 'signupCtrl'
		// })
		// .when('/login',{
		// 	templateUrl: 'login.html',
		// 	controller: 'loginCtrl'
		// })
		.when('/ideas',{
			templateUrl: 'ideas.html',
			controller: 'ideaCtrl'
		})
	}])
	.controller('mainCtrl', ['$rootScope','$scope','$location','firebaseReference', function($rootScope, $scope, $location, firebaseReference){
		var ref = firebaseReference;
		var authData = ref.getAuth();
		if (authData){
			$scope.userId = authData.uid;
			var userId = $scope.userId;
			if (userId.indexOf("anonymous:") > -1){
				console.log('log in to see recent ideas');
			} else {
				$scope.loggedIn = true;
				$location.path('/ideas');	
			}
			
		}
		$scope.login = function(){
			ref.authWithOAuthPopup("github", function(error, authData) {
				if (error) {
					if (error.code === "TRANSPORT_UNAVAILABLE") {
						ref.authWithOAuthRedirect("github", function(error){
							console.log("Login Failed!", error);
						});
					} else {
					console.log("Login Failed!", error);
					}
				} else {
					$rootScope.userId = authData.uid;
					$rootScope.loggedIn = true;
					$location.path('/ideas');
					$scope.$apply();
					console.log("Authenticated successfully with payload:", authData);
					
				}
			});
		}
		$scope.loginAnon = function(){
			ref.authAnonymously(function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					$rootScope.userId = authData.uid;
					console.log("Authenticated successfully with payload:", authData);
					$location.path('/ideas');
					$scope.$apply();
				}
			});
		}
	}])
	// .controller('signupCtrl', ['$scope', function($scope){
	// }])
	// .controller('loginCtrl', ['$scope', function($scope){
	// }])
	.controller('ideaCtrl',['$rootScope','$scope','$http','$location','firebaseReference', function($rootScope, $scope, $http, $location, firebaseReference){
		$scope.numbers = [1,2,3];
		var ref = firebaseReference;
		var authData = ref.getAuth();
		if (authData){
			$scope.userId = authData.uid;
			var userId = $scope.userId;
			if (userId.indexOf("anonymous:") > -1){
				console.log('log in to see recent ideas');
			} else {
				$scope.loggedIn = true;	
			}
			
		}
		// console.log(userId);
		var userRef = ref.child(userId);
		userRef.once("value", function(snapshot){
			$scope.prevIdeas = snapshot.val();
			$scope.$apply();
		})
		$scope.selectService = function(){
			$http.get("http://apis.io/api/search?q=all&limit=217").success(function(data){
				var random = data;
				$scope.ideas = [];
				for (i=0; i<$scope.serviceNumber;i++){
					var num = Math.floor(Math.random() * 217);
					$scope.ideas.push(random.data[num]);
				}
				userRef.push($scope.ideas);
				userRef.on("value", function(snapshot){
					console.log(snapshot.val());
					$scope.prevIdeas = snapshot.val();
					$scope.$apply();
				})
			})
		}
		$scope.logOut = function(){
			userRef.unauth();
			$scope.loggedIn = false;
			$location.path('/');
		}
	}])