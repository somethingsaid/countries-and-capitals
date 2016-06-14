var ccCountry = angular.module('ccCountry', ['ccLibrary']);

ccCountry.controller('countriesCtrl', ['$http', '$scope', '$rootScope', 'Params', 'getCountryData', function($http, $scope, $rootScope, Params, getCountryData) {
	var countryListParams = new Params();
	console.log(countryListParams);
  getCountryData(null, countryListParams).then(function(response) {
  	$scope.countries = response.data.geonames;
  	console.log($scope.countries);
  }, function(response) {
  	console.log('Something is wrong');
  });
}]);