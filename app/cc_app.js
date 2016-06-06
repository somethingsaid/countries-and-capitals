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
.controller('homeCtrl', ['$scope', function($scope) {
	// empty for now
}])
.controller('countriesCtrl', ['$http', '$scope', 'Params', '$rootScope', function($http, $scope, Params, $rootScope) {
	$rootScope.countryListParams = new Params();
	console.log($rootScope.countryListParams);
	// Making a call to return high level information on all available countries
  $http({
  	url: 'http://api.geonames.org/countryInfo?',
  	method: 'GET',
  	params: $rootScope.countryListParams
  })
  .then(function(response) {
  	$scope.countries = response.data.geonames;
  	console.log($scope.countries);
  }, function(response) {
  	console.log('Something is wrong');
  });
}])
.controller('countryCodeCtrl', ['$http', '$scope', 'countryCode', 'Params', '$rootScope', function($http, $scope, countryCode, Params, $rootScope) {
	// Appending country to parameters for specific search
	var countryParams = new Params();
	countryParams.country = countryCode;
	console.log("Country specific parameters: " + JSON.stringify(countryParams));
	// Returning specific country information
	$http({
		url: 'http://api.geonames.org/countryInfo?',
  	method: 'GET',
  	params: countryParams
	})
	.then(function(response) {
		$scope.country = response.data.geonames;
		console.log($scope.country);
		// Piecing together capital city parameters
		var capitalParams = {
  	  q: $scope.country[0].capital,
  	  name_equals: $scope.country[0].capital,
  	  country: $scope.country[0].countryCode,
  	  isNameRequired: true,
  	  maxRows: 10,
  	  username: 'bckwong'
    };
    $http({
  	  url: 'http://api.geonames.org/searchJSON?',
  	  method: 'GET',
      params: capitalParams
    })
    .then(function(response) {
  	  var capitalSet = response.data.geonames;
  	  console.log(capitalSet);
  	  // filter through array, return where object's fcodeName is 'capital of a political entity';
  	  $scope.capital = capitalSet.filter(function(item) {
  	  	return item.fcodeName === 'capital of a political entity';
  	  });
  	  console.log ("Number of results: " + $scope.capital.length + "\nFiltered list of capitals: " + JSON.stringify($scope.capital));

    }, function(response) {
  	  console.log('Something went wrong with the capital query');
    });
	}, function(response) {
		console.log('Something is wrong');
	});
}]);