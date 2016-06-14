var ccCountryCode = angular.module('ccCountryCode', ['ccLibrary']);

ccCountryCode.controller('countryCodeCtrl', ['$http', '$scope', 'countryCode', 'Params', 'getCountryData', function($http, $scope, countryCode, Params, getCountryData) {
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