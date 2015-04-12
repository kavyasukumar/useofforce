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

    $scope.ranges = subjects.getRanges();

    $scope.selections={};
    var defaultval = "-All-";
    $scope.selections.gender=defaultval;
    $scope.selections.ethnicity = defaultval;
    $scope.selections.injuryLevel = defaultval;
    $scope.selections.shotAtPolice = defaultval;
    $scope.selections.weapons = defaultval;
    $scope.selections.year = defaultval;
    $scope.selections.agerange = defaultval;

    $scope.update = function(){
        subjects.filterList($scope.selections);
    }
  });
