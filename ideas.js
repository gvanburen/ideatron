angular.module('ideaTron',['ngRoute','ngAnimate'])
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
		.when('/signup',{
			templateUrl: 'signup.html',
			controller: 'signupCtrl'
		})
		.when('/login',{
			templateUrl: 'login.html',
			controller: 'loginCtrl'
		})
		.when('/ideas',{
			templateUrl: 'ideas.html',
			controller: 'ideaCtrl'
		})
	}])
	.controller('mainCtrl', ['$scope','$location', function($scope, $location){
		$scope.logMeIn = function(){
			var ref = new Firebase('https://burning-heat-343.firebaseio.com/ideas');//firebaseReference;
			ref.authWithOAuthPopup("github", function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);
					$location.path('/ideas');
				}
			});
		}
		$scope.logMeInAnon = function(){
			var ref = new Firebase('https://burning-heat-343.firebaseio.com/ideas');//firebaseReference;
			ref.authAnonymously(function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				} else {
					console.log("Authenticated successfully with payload:", authData);
					$location.path('/ideas');
				}
			});
		}
	}])
	.controller('signupCtrl', ['$scope', function($scope){
		
	}])
	// .controller('loginCtrl', ['$scope', function($scope){
	// 	$scope.signIn = function(){
	// 		var ref = firebaseReference;
	// 		ref.authWithOAuthPopup("github", function(error, authData) {
	// 			if (error) {
	// 				console.log("Login Failed!", error);
	// 			} else {
	// 				console.log("Authenticated successfully with payload:", authData);
	// 			}
	// 		});
	// 		$scope.loginEmail = "";
	// 		$scope.loginPassword = "";
	// 	}
	// 	$scope.signInAnon = function(){
	// 		var ref = firebaseReference;
	// 		ref.authAnonymously(function(error, authData) {
	// 			if (error) {
	// 				console.log("Login Failed!", error);
	// 			} else {
	// 				console.log("Authenticated successfully with payload:", authData);
	// 			}
	// 		});
	// 	}
	// }])
	.controller('ideaCtrl',['$scope','$http', function($scope, $http){
		$scope.selectService = function(){
			var random = Math.floor(Math.random() * (217-$scope.serviceNumber));
			console.log($scope.serviceNumber);
			console.log(random);
			$http.get("http://apis.io/api/search?q=all&skip=" + random + "&limit=" + $scope.serviceNumber).success(function(data){
				$scope.ideas = data.data;
				console.log(data);
			})
		}	
	}])