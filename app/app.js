
var app = angular.module('ClearlyInventoryApp', ['ngRoute', 'ngSanitize', 'LocalStorageModule', 'angular-loading-bar', 'ngCordova', 'ui.sortable']);

app.config(function ($routeProvider) {


    $routeProvider.when("/status", {
        controller: "statusController",
        templateUrl: "app/views/status.html"
    });

   
    $routeProvider.otherwise({ redirectTo: "/status" });

});

//var serviceBaseUrl = 'http://localhost:7440/';
//var serviceBase = 'http://localhost:7440/API/ClearlyInventoryAPI.svc/';
var serviceBaseUrl = 'http://dev.style.u8i9.com/';
var serviceBase = 'http://dev.style.u8i9.com/API/ClearlyInventoryAPI.svc/';

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});


app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

// factory for all messages 
app.factory('log', function () {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-top-right',
    };
    return {
        success: function (text) {
            toastr.success(text, "Success");
        },
        error: function (text) {
            toastr.error(text, "Error");
        },
        info: function (text) {
            toastr.info(text, "Info");
        },
        warning: function (text) {
            toastr.warning(text, "Warning");
        },
    };
});


 