angular.module('ideaTron',['ngRoute','ngAnimate'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
		//presents a login screen to user
		//can choose to skip login
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
	.controller('mainCtrl', ['$scope', function($scope){

	}])
	.controller('signupCtrl', ['$scope', function($scope){
		
	}])
	.controller('loginCtrl', ['$scope', function($scope){
		$scope.loginEmail = "";
		$scope.loginPassword = "";
		$scope.signIn = function(email,password){
			console.log(email, password);
			$scope.loginEmail = "";
			$scope.loginPassword = "";
		}
	}])
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