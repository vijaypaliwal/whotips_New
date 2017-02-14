'use strict';
app.controller('tipsController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    var insertStatementTips = "INSERT INTO Tips (Note) VALUES (?)";
    var createStatementTips = "CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, Note TEXT)";
    var selectAllTipsStatement = "SELECT * FROM Tips ORDER BY Note";
    var updateStatementContact = "UPDATE Contacts SET Tips=? WHERE id=?";
    var selectAllStatement = "SELECT * FROM Contacts";
    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database
    $scope.Tips = [];
    $scope.Contacts = [];

    $scope.CheckQueryVar = false;
    $scope.OldValue = "";
    $scope.EditTipObj = { id: 0, Text: "" };
    var dataset;
    $scope.SearchText = "";
    var DataType;
    var updateStatement = "UPDATE Tips SET Note = ? WHERE id=?";
    var deleteStatement = "DELETE FROM Tips WHERE id=?";
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


    var _InsertDatasql = "INSERT INTO Artist(Id,Title) VALUES ('1','Fred');";
    var successFn = function (count) {
        alert("Successfully imported " + count + " SQL statements to DB");
    };
    var errorFn = function (error) {
        alert("The following error occurred: " + error.message);
    };
    var progressFn = function (current, total) {
        console.log("Imported " + current + "/" + total + " statements");
    };

    function ImportData() {

        cordova.plugins.sqlitePorter.importSqlToDb(db, _InsertDatasql, {
            successFn: successFn,
            errorFn: errorFn,
            progressFn: progressFn
        });
    }

    var successFnEx = function (sql, count) {
        alert(sql);
        _InsertDatasql = _InsertDatasql;
        alert("Exported SQL contains " + count + " statements");
        setTimeout(function () {
            alert("import calling");
            ImportData();

        },1000);
    };
    function ExportData() {
        alert("export Data");
     
        cordova.plugins.sqlitePorter.exportDbToSql(db, {
            successFn: successFnEx
        });
    }

    function createTable()  // Function for Create Table in SQLite.

    {
        

        db.transaction(function (tx) { tx.executeSql(createStatementTips, [], showRecordTips, null); });


    }
    $scope.ClearSearchText = function () {
        $scope.SearchText = "";
        CheckScopeBeforeApply();
    }
    function onError(tx, error) // Function for Hendeling Error...

    {

        alert(error.message);

    }
    function showRecordTips() // Function For Retrive data from Database Display records as list

    {


        $scope.Tips = [];
        db.transaction(function (tx) {
            tx.executeSql(selectAllTipsStatement, [], function (tx, result) {
                dataset = result.rows;
                for (var i = 0, item = null; i < dataset.length; i++) {

                    item = dataset.item(i);
                    var _TempObj = { id: (item['id']).toString(), Text: (item['Note']).toString() };
                    $scope.Tips.push(_TempObj);

                }
              

                alasql("SELECT * INTO CSV('names.csv',{headers:true}) FROM ?", [$scope.Tips]);
                CheckScopeBeforeApply();
            });

        });

    }

    function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..

    {


        db.transaction(function (tx) {
            tx.executeSql(deleteStatement, [id], showRecordTips, onError);
            updateRecordTips(2);
            log.success("Delete Sucessfully");
        });


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
                CheckScopeBeforeApply();
                console.log($scope.Contacts);
            });

        });
    }

    function checkSuccess(_ID) {
        $scope.CheckQueryVar = false;
        CheckScopeBeforeApply();
    }



    function updateRecordTips(Type) // Function For Retrive data from Database Display records as list

    {
        localStorageService.set("RecentlyAddedTips", "");
        db.transaction(function (tx) {
            tx.executeSql(selectAllStatement, [], function (tx, result) {
                
                dataset = result.rows;

                iteration(0, dataset, Type);


             

                CheckScopeBeforeApply();
            });

        });

    }

    var _i = 0;
    function iteration(_i, rows, Type) {

        var item = rows.item(_i);
        var _tips = item['Tips'];
        var _id = item['id'];



        db.transaction(function (tx) {
            SearchText(_tips, function (matched) {
                
                if (!matched) {
                } else {

                    if (Type == 1) {
                        _tips = _tips.replace($scope.OldValue, $scope.EditTipObj.Text);

                    }
                    else {
                        var y = _tips.split(",");
                        y = jQuery.grep(y, function (value) {
                            return value != $scope.OldValue;
                        });

                        _tips = $.map(y, function (obj) {
                            return obj
                        }).join(",");
                    }
                }

            tx.executeSql(updateStatementContact, [_tips, _id], function () {

                _i += 1;
                if (_i < rows.length) {

                    iteration(_i, rows, Type);
                }
                else {

                }
            }, onError);
            });

        });


    }

    function SearchText(value, callback) {
        
        var data = value.split(",");
        var contains = (data.indexOf($scope.OldValue) > -1);
        callback(contains);

        return;


    }
    $scope.DeleteRecord = function (id, value) {
        var _confirm = confirm("Are you sure to remove this tip?");
        if (_confirm) {

            deleteRecord(id);
            $scope.OldValue = value;
            CheckScopeBeforeApply();

        }
    }

    $scope.EditTip = function (_obj) {
        $scope.EditTipObj = { id: 0, Text: "" };
        $scope.OldValue = "";
        $scope.EditTipObj = angular.copy(_obj);
        $scope.OldValue = _obj.Text;
        CheckScopeBeforeApply();
        $("#modal1").modal('show');

    }

    function ShowSuccess() {
        //
        $("#modal1").modal('hide');
        showRecordTips();
        log.success("updated successfully");
        updateRecordTips(1);
        CheckScopeBeforeApply();
    }
    $scope.UpdateTip = function () {
        db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.EditTipObj.Text, $scope.EditTipObj.id], ShowSuccess(), onError); });
    }
    function init() {


        initDatabase();

        CheckScopeBeforeApply();
    }

    init();



}]);