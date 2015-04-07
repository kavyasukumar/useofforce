'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/subjects', {
        templateUrl: 'views/subjects.html',
        controller: 'SubjectsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
   .factory('subjects', function ($http) {
     var dataset = { data:null};
     var currentSubject ={data: null}
     var propRanges = {}
     var currentId = 0;
     var dataService = {};
     
     $http.get("data/subjects.json").success(function (data, status, headers, config) {
        dataset.data = data;
        currentSubject.data = data[currentId];

        resetFilters();

        for (var prop in dataset.data[0]) {
          if(dataset.data[0].hasOwnProperty(prop)){
              propRanges[prop] = _.chain(dataset.data)
                        .pluck(prop)
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();
          }
        }
     });
     var resetFilters = function(){
      //temp hack till subjects json is updated
        for(var i=0;i< dataset.data.length;i++){
          dataset.data[i].filterPass=true;
        }
     }
     dataService.getList = function () {
         return dataset;
     }
     dataService.getRanges = function() {
        return propRanges;
     }
     dataService.filterList = function(selections){
      //testing logic
      resetFilters();
      if(selections.gender=="-All-"){
        return;
      }
      for(var i=0;i< dataset.data.length;i++){
        if(dataset.data[i].gender!=selections.gender){
          dataset.data[i].filterPass=false;
        }
      }
     }
     // dataService.getDetails = function(id){
     //    currentId = id;
     //    if(dataset.data){            
     //        currentSubject.data = $.grep(dataset.data,function(a){ return a.id == id;});
     //        if(currentSubject.data)
     //        {
     //            currentSubject.data=currentSubject.data[0];
     //        }
     //    }
     //    return currentSubject.data;
     // }
    return dataService;
  });
