'use strict';

describe('Controller: IncidentsCtrl', function () {

  // load the controller's module
  beforeEach(module('useOfForceApp'));

  var IncidentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IncidentsCtrl = $controller('IncidentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
