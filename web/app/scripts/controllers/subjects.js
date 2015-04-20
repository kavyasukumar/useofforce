'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:SubjectscontrollerCtrl
 * @description
 * # SubjectsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('SubjectsCtrl', function ($scope, $location, dataFactory) {

    $('#cover').height('50vh');
    $scope.dataset = dataFactory.getDataset($scope.selections);

    $scope.selections={};

    var defaultval = "-All-";

    $scope.selections.gender=defaultval;
    $scope.selections.ethnicity = defaultval;
    $scope.selections.injuryLevel = defaultval;
    $scope.selections.shotAtPolice = defaultval;
    $scope.selections.weapons = defaultval;
    $scope.selections.year = defaultval;
    $scope.selections.agencies = defaultval;
    $scope.selections.incidentCity = defaultval;
    $scope.selections = _.extend($scope.selections,$location.search());
    
    dataFactory.setFilters($scope.selections);
    $scope.ranges = dataFactory.getFilterRanges();


    $scope.update = function(){
        $location.search(getNonDefaultSelections());
    }

    $scope.getBarWidth = function(){
        if($scope.dataset && $scope.dataset.totalSubjects != 0)
        {
            return 100*$scope.dataset.filteredSubjectsCount/$scope.dataset.totalSubjects;
        }
        return 0;
    }

    $scope.go = function ( path ) {
        $location.search([]);
        $location.path(path);
    };

    
    function getNonDefaultSelections(){
        var culledList = {};
        for (var prop in $scope.selections) {
          if($scope.selections.hasOwnProperty(prop) && $scope.selections[prop]!=defaultval){
                culledList[prop]= $scope.selections[prop];
          }
        }
        return culledList;
    }
  });
