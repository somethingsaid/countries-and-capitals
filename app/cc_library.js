var ccLibrary = angular.module('ccLibrary', []);

ccLibrary.constant("Params", function() {
	this.username = 'bckwong';
	this.lang = 'en';
	this.type = 'JSON';
});

ccLibrary.factory('getCountryData', ['$http', function($http) {
	return function(endpoint, parameters) {
		return $http({
			url: endpoint || 'http://api.geonames.org/countryInfo?',
			method: 'GET',
			params: parameters
		});
	}
}]);