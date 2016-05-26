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
	.when('/error', {
		template: '<p>Error - Page Not Found</p>'
	})
	.otherwise('/error');
}]);