
var app = angular.module('ClearlyInventoryApp', ['ngRoute', 'ngSanitize', 'LocalStorageModule', 'angular-loading-bar', 'ngCordova', 'ui.sortable']);

app.config(function ($routeProvider) {


    $routeProvider.when("/status", {
        controller: "statusController",
        templateUrl: "app/views/status.html"
    });

    $routeProvider.when("/addtips", {
        controller: "addtipsController",
        templateUrl: "app/views/addtips.html"
    });

    $routeProvider.when("/find", {
        controller: "findController",
        templateUrl: "app/views/find.html"
    });

    $routeProvider.when("/SearchData", {
        controller: "findController",
        templateUrl: "app/views/SearchData.html"
    });

    $routeProvider.when("/tips", {
        controller: "tipsController",
        templateUrl: "app/views/tips.html"
    });

    $routeProvider.when("/more", {
        controller: "statusController",
        templateUrl: "app/views/more.html"
    });

    $routeProvider.when("/menu", {
        controller: "menuController",
        templateUrl: "app/views/menu.html"
    });

    $routeProvider.when("/users", {
        controller: "usersController",
        templateUrl: "app/views/users.html"
    });

    $routeProvider.otherwise({ redirectTo: "/menu" });

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


 