'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:SubjectscontrollerCtrl
 * @description
 * # SubjectscontrollerCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('SubjectsCtrl', function ($scope, subjects) {
    $scope.subjects = subjects.getList();

    $scope.ranges = subjects.propRanges;
  });
