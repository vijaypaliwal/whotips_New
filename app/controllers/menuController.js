'use strict';
app.controller('menuController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


  
    localStorageService.set("ContactSearchObj", "");
    localStorageService.set("EditContactSearchObj", null);

}]);