'use strict';
app.controller('menuController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    var selectAllStatement = "SELECT * FROM Contacts";

    $scope.Contacts = [];
    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT,Tips TEXT,Hair TEXT,Skin TEXT,Height TEXT)";
    var updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ? WHERE id=?";
    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database
    $scope.EditObj = { id: 0, firstName: "", lastName: "" };
    var deleteStatement = "DELETE FROM Contacts WHERE id=?";
    var dataset;
    $scope.SearchText = "";
    var DataType;
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    function initDatabase()  // Function Call When Page is ready.

    {

        try {

            if (!window.openDatabase)  // Check browser is supported SQLite or not.

            {

                alert('Databases are not supported in this browser.');

            }

            else {


                createTable();  // If supported then call Function for create table in SQLite

            }

        }

        catch (e) {

            if (e == 2) {

                // Version number mismatch. 

                console.log("Invalid database version.");

            } else {

                console.log("Unknown error " + e + ".");

            }

            return;

        }

    }

    function createTable()  // Function for Create Table in SQLite.

    {

        db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, null); });


    }

  


    function onError(tx, error) // Function for Hendeling Error...

    {

        alert(error.message);

    }
    function showRecords() // Function For Retrive data from Database Display records as list

    {

        $scope.Contacts = [];
        db.transaction(function (tx) {

            tx.executeSql(selectAllStatement, [], function (tx, result) {
                dataset = result.rows;

                for (var i = 0, item = null; i < dataset.length; i++) {

                    item = dataset.item(i);
                    var _TempObj = { id: (item['id']).toString(), firstName: (item['firstName']).toString(), lastName: (item['lastName']).toString(), email: (item['email']).toString(), gender: (item['gender']), places: (item['places']).toString(), AgeType: (item['AgeType']).toString(), imagepath: (item['imagepath']).toString(), Relations: (item['Relations']).toString(), Tips: (item['Tips']).toString(), Hair: (item['Hair']).toString(), Skin: (item['Skin']).toString(), Height: (item['Height']).toString() };
                    $scope.Contacts.push(_TempObj);

                }

                console.log($scope.Contacts);
                CheckScopeBeforeApply();
            });

        });
    }

    $scope.OpenEditModal = function (_obj) {
        debugger;

        localStorageService.set("EditContactSearchObj", _obj);
        $location.path("/addtips");
      
    }

    $scope.gotoAddtips = function () {

        localStorageService.set("EditContactSearchObj", "");
        $location.path("/addtips");

    }
  
    function ShowSuccess() {
       
        $("#modal1").modal('hide');
        showRecords();
        log.success("updated successfully");
        CheckScopeBeforeApply();
    }
  

    function init() {
        initDatabase();
    }

    init();
}]);