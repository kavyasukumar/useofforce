'use strict';

describe('Controller: SubjectscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var SubjectscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubjectscontrollerCtrl = $controller('SubjectscontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
