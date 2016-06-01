angular.module('ccApp', ['ngRoute', 'ngAnimate'])
.constant("countryListParams", {username: 'bckwong', lang: 'en', type: 'JSON'})
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
.controller('countriesCtrl', ['$http', '$scope', 'countryListParams', function($http, $scope, countryListParams) {
	console.log(countryListParams);
	// Making a call to return high level information on all available countries
  $http({
  	url: 'http://api.geonames.org/countryInfo?',
  	method: 'GET',
  	params: countryListParams
  })
  .then(function(response) {
  	$scope.countries = response.data.geonames;
  	console.log($scope.countries);
  }, function(response) {
  	console.log('Something is wrong');
  });
}])
.controller('countryCodeCtrl', ['$http', '$scope', 'countryCode', 'countryListParams', function($http, $scope, countryCode, countryListParams) {
	// Appending country to parameters for specific search
	var countryParams = countryListParams;
	countryParams.country = countryCode;
	console.log("Country specific parameters: " + JSON.stringify(countryParams));
	console.log("Original parameters for all countries: " + JSON.stringify(countryListParams));
	$http({
		url: 'http://api.geonames.org/countryInfo?',
  	method: 'GET',
  	params: $scope.countryParams
	})
	.then(function(response) {
		$scope.country = response.data.geonames;
		console.log($scope.country);
	}, function(response) {
		console.log('Something is wrong');
	})
}]);