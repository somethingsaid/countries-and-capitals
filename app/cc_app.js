angular.module('ccApp', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: './home/home.html',
		controller: 'homeCtrl'
	})
	.when('/countries', {
		templateUrl: './countries/countries.html',
		controller: 'countriesCtrl'
	})
	.when('/countries/:countryCode', {
		templateUrl: './country-code/country_code.html',
		controller: 'countryCodeCtrl',
		resolve: {
			countryCode: function($route) {
				var countryCode = $route.current.params.countryCode;
				return countryCode;
			}
		}
	}) 
	.when('/error', {
		template: '<p>Error - Page Not Found</p><button><a href="#/">Home</a></button><button><a href="#/countries">Browse Countries</a></button>'
	})
	.otherwise('/error');
}])
.controller('homeCtrl', ['$scope', function($scope) {
	// empty for now
}])
.controller('countriesCtrl', ['$http', '$scope', function($http, $scope) {
	var params = {
		username: 'bckwong',
		lang: 'en',
		type: 'JSON'
	};
  $http({
  	url: 'http://api.geonames.org/countryInfo?',
  	method: 'GET',
  	params: params
  })
  .then(function(response) {
  	$scope.countries = response.data.geonames;
  	console.log($scope.countries);
  }, function(response) {
  	console.log('Something is wrong');
  });
}])
.controller('countryCodeCtrl', ['$http', '$scope', 'countryCode', function($http, $scope, countryCode) {
	$scope.countryCode = countryCode;
}]);