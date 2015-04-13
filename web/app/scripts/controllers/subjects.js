'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:SubjectscontrollerCtrl
 * @description
 * # SubjectsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('SubjectsCtrl', function ($scope, $location, subjects) {
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
    $scope.selections = _.extend($scope.selections,$location.search());

    subjects.setCriteria($scope.selections);

    function getNonDefaultSelections(){
        var culledList = {};
        for (var prop in $scope.selections) {
          if($scope.selections.hasOwnProperty(prop) && $scope.selections[prop]!=defaultval){
                culledList[prop]= $scope.selections[prop];
          }
        }
        return culledList;
    }

    $scope.update = function(){
        $location.search(getNonDefaultSelections());
        subjects.filterList($scope.selections);
    }
  });
