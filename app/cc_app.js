angular.module('ccApp', ['ngRoute', 'ngAnimate'])
.constant("Params", function() {
	this.username = 'bckwong';
	this.lang = 'en';
	this.type = 'JSON';
})
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
.factory('getCountryData', ['$http', function($http) {
	return function(endpoint, parameters) {
		return $http({
			url: endpoint || 'http://api.geonames.org/countryInfo?',
			method: 'GET',
			params: parameters
		});
	}
}])
.controller('homeCtrl', ['$scope', function($scope) {
	// empty for now
}])
.controller('countriesCtrl', ['$http', '$scope', '$rootScope', 'Params', 'getCountryData', function($http, $scope, $rootScope, Params, getCountryData) {
	var countryListParams = new Params();
	console.log(countryListParams);
  getCountryData(null, countryListParams).then(function(response) {
  	$scope.countries = response.data.geonames;
  	console.log($scope.countries);
  }, function(response) {
  	console.log('Something is wrong');
  });
}])
.controller('countryCodeCtrl', ['$http', '$scope', 'countryCode', 'Params', 'getCountryData', function($http, $scope, countryCode, Params, getCountryData) {
	// Appending country to parameters for specific search
	var countryParams = new Params();
	countryParams.country = countryCode;
	console.log("Country specific parameters: " + JSON.stringify(countryParams));
	var neighbourUrl = 'http://api.geonames.org/neighbours?';
	var capitalUrl = 'http://api.geonames.org/searchJSON?';

	// Call and Return specific country neighbour information
	getCountryData(neighbourUrl, countryParams).then(function(response) {
		$scope.neighbours = response.data.geonames;
		console.log("Number of neighbours: " + $scope.neighbours.length);
		for (var i = 0; i < $scope.neighbours.length; i++) {
			console.log("Neighbour " + (i + 1) + ": " + $scope.neighbours[i].countryName);
		}
	}, function(response) {
			console.log("Something went wrong when retrieving list of neighbours");
	});

	// Returning specific country information
	getCountryData(null, countryParams).then(function(response) {
		$scope.country = response.data.geonames;
		console.log($scope.country);

		// Piecing together capital city parameters from country API response
		var capitalParams = {
  	  q: $scope.country[0].capital,
  	  name_equals: $scope.country[0].capital,
  	  country: $scope.country[0].countryCode,
  	  isNameRequired: true,
  	  maxRows: 10,
  	  username: 'bckwong'
    };
    getCountryData(capitalUrl, capitalParams).then(function(response) {
    	var capitalSet = response.data.geonames;
    	console.log(capitalSet);
    	$scope.capital = capitalSet.filter(function(item) {
    		return item.fcodeName === 'capital of a political entity';
    	});
    	console.log("Number of results: " + $scope.capital.length + "\nFiltered list of capitals: " + JSON.stringify($scope.capital));
    }, function(response) {
    	console.log("Something went wrong with the capital query");
    });
	}, function(response) {
		console.log("Something went wrong retrieving data about: " + countryCode);
	});
}]);