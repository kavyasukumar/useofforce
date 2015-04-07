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
    $scope.selections.gender="-All-";
    $scope.selections.ethnicity = 'Asian';

    $scope.update = function(){
    	console.log($scope.selections.gender + $scope.selections.ethnicity);

    	subjects.filterList($scope.selections);
    }
  });
