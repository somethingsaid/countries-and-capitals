// Unit Testing the getCountryData() service
describe("getCountryData", function() {
	beforeEach(module("ccLibrary"));

	it("should return a response object when called",
	inject(function(getCountryData, $rootScope, $httpBackend, Params) {
		$httpBackend.expect('GET', 'http://api.geonames.org/countryInfo?&lang=en&type=JSON&username=bckwong').respond(200);
		var status = false;
		var testParams = new Params();
		getCountryData(null, testParams).then(function() {
			status = true;
		});
		$rootScope.$digest();
    $httpBackend.flush();
    expect(status).toBe(true);
    $httpBackend.verifyNoOutstandingRequest();
	}));
});

// Unit Test the Country List Controller

// Unit Test the Country-specific Controller