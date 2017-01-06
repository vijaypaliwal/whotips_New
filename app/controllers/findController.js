'use strict';
app.controller('findController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: "", imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
    $scope.NewTips = { Text: "" };
    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT,Tips TEXT,Hair TEXT,Skin TEXT,Height TEXT)";
    var createStatementTips = "CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, Note TEXT)";
    var selectAllStatement = "SELECT * FROM Contacts";
    var selectAllTipsStatement = "SELECT * FROM Tips ORDER BY Note";
    var deleteStatement = "DELETE FROM Contacts WHERE id=?";
    $scope.Tips = [];
    $scope.TipsCopy = [];
    $scope.Contacts = [];
    $scope.ContactsCopy = [];
    $scope.ContactTips = [];
    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database
    $scope.SelectedContactObject = {};
    var dataset;

    var DataType;

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
    function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..

    {

        var iddelete = id.toString();

        db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); log.success("Delete Sucessfully"); });


    }

    function updateRecord() // Get id of record . Function Call when Delete Button Click..

    {



        db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations], loadAndReset, onError); });

    }

    function onError(tx, error) // Function for Hendeling Error...

    {

        alert(error.message);

    }
    function createTable()  // Function for Create Table in SQLite.

    {

        db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, onError); });
        db.transaction(function (tx) { tx.executeSql(createStatementTips, [], showRecordTips, onError); });


    }


    $scope.DeleteRecordData = function (id) {
        var _confirm = confirm("Are you sure to remove this contact?");
        if (_confirm) {

            deleteRecord(id);
            $("#modal3").modal('hide');
            $scope.ContactsCopy = [];
            CheckScopeBeforeApply();
        }
    }
    $scope.getHairImage = function (Hair) {
        switch (Hair) {
            case "Bald":
            case 1:
            case "1":
                return "bald.png";
                break;
            case "Dark":
            case 2:
            case "2":
                return "dark.png";
                break;
            case "Brown":
            case 3:
            case "3":
                return "brown.png";
                break;
            case "Blond":
            case 4:
            case "4":
                return "blond.png";
                break;
            case "Red":
            case 5:
            case "5":
                return "red.png";
                break;
            case "Grey":
            case 6:
            case "6":
                return "grey.png";
                break;
            default:

        }
    }

    $scope.GetAgeType = function (Type) {
         
        switch (Type) {
            case 1:
            case "1":
                return "Much Younger than Me";
                break;
            case 2:
            case "2":
                return "My Generation";
                break;
            case 3:
            case "3":
                return "Much Older than me";
                break;
            default:
                return "Relative Age";

        }
    }
   
    $scope.GetSkinClass = function (Type) {
        switch (Type) {
            case "Like Mine":
            case "1":
            case 1:
                return "mine";
                break;
            case "Darker Mine":
            case "2":
            case 2:
                return "darkmine";
                break;
            case "Lighter Mine":
            case "3":
            case 3:
                return "lightmine";
                break;
            default:

        }
        return "";
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
                    $scope.ContactsCopy.push(_TempObj);
                }
            
                $scope.Contacts = $scope.FilterByType($scope.ContactsCopy);
                CheckScopeBeforeApply();
              
                
            });

        });
    }



    $scope.OpenEditModal=function(_obj)
    {
        localStorageService.set("EditContactSearchObj", _obj);
        $location.path("/addtips");
        $("#modal3").modal("hide");
       
    }

    $scope.FilterByTips=function(_TipsArray,_Contacts)

    {
         
        var _TempArray = [];
         
        for (var i = 0; i < _TipsArray.length; i++) {
            for (var j = 0; j < _Contacts.length; j++) {
                if ($.trim(_Contacts[j].Tips) != "") {

                    if (_Contacts[j].Tips.indexOf(_TipsArray[i].Text) !== -1) {
                        if (pluckByNameNew(_TempArray, _TipsArray[i].Text, true, 0) == false) {

                            _TempArray.push(_TipsArray[i]);
                        }
                    }

                  

                }
            }
        }
        return _TempArray;
    }

    function pluckByNameNew(inArr, name, exists, _length) {
        var _returnVar = false;
        if (inArr.length > 0) {

            var i = 0;
            for (i = 0; i < inArr.length; i++) {
                if (inArr[i] != undefined && inArr[i].Text == name) {
                    _returnVar = true;
                    break;
                }
                else {
                    _returnVar = false;
                }
            }
        }
        else {
            _returnVar = false;
        }

        return _returnVar;
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
                        $scope.TipsCopy.push(_TempObj);

                    }
                    $scope.Tips = $scope.FilterByTips($scope.TipsCopy, $scope.Contacts);

                    CheckScopeBeforeApply();
                    console.log($scope.Tips);
                });

            });
        
    }


    function GetSkin(_Type) {
         
        switch (_Type) {
            case 1:
                return "Like Mine";
                break;
            case 2:
                return "Darker Mine";
                break;
            case 3:
                return "Lighter Mine";
                break;
            default:
                return "";

        }

    }

    function GetHairs(_Type) {
        switch (_Type) {
            case 1:
                return "Bald";
                break;
            case 2:
                return "Dark";
                break;
            case 3:
                return "Brown";
                break;
            case 4:
                return "Blond";
                break;
            case 5:
                return "Red";
                break;
            case 6:
                return "Grey";
                break;
            default:
                return "";

        }

    }

    function GetHeight(_Type) {
        switch (_Type) {
            case 1:
                return "About My Height";
                break;
            case 2:
                return "Taller Than me";
                break;
            case 3:
                return "Younger Than me";
                break;

            default:
                return "";
        }

    }
    $scope.AddtoTips = function (text) {

        if ($.trim($scope.ContactObject.Tips) != "") {

            SearchText(text, function (matched) {

                if (!matched) {
                    $scope.ContactObject.Tips = $scope.ContactObject.Tips + "," + text;
                    $scope.ContactTips.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
                } else {
                    var y = angular.copy($scope.ContactTips);
                    y = jQuery.grep(y, function (value) {
                        return value.Text != text;
                    });

                    $scope.ContactTips = angular.copy(y);
                    $scope.ContactObject.Tips = $.map($scope.ContactTips, function (obj) {
                        return obj.Text
                    }).join(", ");
                }
            });

        }
        else {
            $scope.ContactObject.Tips = text;
            $scope.ContactTips.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
        }
        $scope.Contacts = $scope.FilterByType($scope.ContactsCopy);
        CheckScopeBeforeApply();
    }
    function SearchText(name, callback) {
        var data = $scope.ContactObject.Tips.split(",");
        var contains = (data.indexOf(name) > -1);
        callback(contains);

        return ;


    }

    $scope.IsAvailable = function (Type, text) {


        var _defaultClass = ""
        switch (Type) {
            case 1:
                for (var i = 0; i < $scope.Connections.length; i++) {
                    if ($scope.Connections[i] == text) {
                        _defaultClass = "greenBG";
                        return _defaultClass;
                    }

                }


                break;
            case 2:
                for (var i = 0; i < $scope.ContactPlaces.length; i++) {
                    if ($scope.ContactPlaces[i] == text) {
                        _defaultClass = "greenBG";
                        return _defaultClass;
                    }

                }
                break;
            case 3:
                for (var i = 0; i < $scope.ContactTips.length; i++) {
                    if ($scope.ContactTips[i].Text == text) {
                        _defaultClass = "green";
                        return _defaultClass;
                    }

                }
                break;
            default:

        }

    }
    function GetTrimmedString(_str) {
        if (_str != null && _str != undefined && $.trim(_str) != "") {
            return true;
        }
        return false;
    }

    $scope.ResetFilter = function () {
        $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: "", imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
        $scope.ContactTips = [];
        localStorageService.set("ContactSearchObj", "");
        $scope.Contacts = $scope.FilterByType($scope.ContactsCopy);
        $(".optionlist").hide();
        CheckScopeBeforeApply();
    }

    $scope.GetGenderClass = function (_G) {
        var _Class = "";
        _Class = _G == "N" ? "" : _G == "M" ? "blue" : "pink";
        return _Class;
    }

    $scope.ClearSearchText=function()
    {
        $scope.NewTips.Text = "";
        CheckScopeBeforeApply();
    }
    function pluckByName(inArr, name, exists) {
        if (inArr.length > 0) {

            var i = 0;
            for (i = 0; i < inArr.length; i++) {
                if (inArr[i] == name) {
                    console.log(inArr[i]);
                    return (exists === true) ? true : inArr[i];
                }
            }
        }
        else {
            return true;
        }

        return false;
    }

    function findMatch(arr1, arr2, value) {
        for (var i = 0; i < arr1.length; i++) {
            if (value.indexOf(arr1[i]) > -1) {
                    return true;
                }
        }

        return false;
    }
    $scope.FilterByType = function (_array) {
         
        if (GetTrimmedString($scope.ContactObject.gender)) {

            _array = jQuery.grep(_array, function (el) {
                return el.gender == $scope.ContactObject.gender;
            });
        }

        if (GetTrimmedString($scope.ContactObject.Skin)) {
            _array = jQuery.grep(_array, function (el) {
                return el.Skin == GetSkin($scope.ContactObject.Skin);
            });
        }

        if (GetTrimmedString($scope.ContactObject.Tips)) {
            _array = jQuery.grep(_array, function (el) {
                return findMatch($scope.ContactObject.Tips.split(","), [],el.Tips);
            });
        }
        if (GetTrimmedString($scope.ContactObject.AgeType)) {
            _array = jQuery.grep(_array, function (el) {
                return el.AgeType == $scope.ContactObject.AgeType;
            });
        }
        if (GetTrimmedString($scope.ContactObject.Hair)) {
            _array = jQuery.grep(_array, function (el) {
                return el.Hair == GetHairs($scope.ContactObject.Hair);
            });
        }
        if (GetTrimmedString($scope.ContactObject.Height)) {

            _array = jQuery.grep(_array, function (el) {
                return el.Height == GetHeight($scope.ContactObject.Height);
            });
        }




        return _array;
    }


    $scope.showdetails = function (_obj) {

        $scope.SelectedContactObject = _obj;
        $("#modal3").modal('show');
        CheckScopeBeforeApply();

    }
     $scope.CheckFilterArray = function () {
        if ($scope.ContactObject.AgeType != '' || $scope.ContactObject.Skin != '' || $scope.ContactObject.Hair != '' || $scope.ContactObject.Height != '')
        {
            return true;
        }
        return false;
    }


    function init() {

      

        initDatabase();
        

        var _contact = localStorageService.get("ContactSearchObj");

        if(_contact!=null && _contact!=undefined)
        {
            $scope.ContactObject = _contact;
        }
        CheckScopeBeforeApply();

    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.UpdateGender = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.gender = $scope.ContactObject.gender == "M" ? "" : "M";
                break;
            case 2:
                $scope.ContactObject.gender = $scope.ContactObject.gender == "F" ? "" : "F";
                break;
            default:
                $scope.ContactObject.gender = $scope.ContactObject.gender == "N" ? "" : "N";


        }
        CheckScopeBeforeApply();
    }


    $scope.UpdateAgeType = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.AgeType = $scope.ContactObject.AgeType == 1 ? "" : 1;
                break;
            case 2:
                $scope.ContactObject.AgeType = $scope.ContactObject.AgeType == 2 ? "" : 2;
                break;
            case 3:
                $scope.ContactObject.AgeType = $scope.ContactObject.AgeType == 3 ? "" : 3;
                break;



        }
        CheckScopeBeforeApply();
    }

    $scope.UpdateSkinType = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.Skin = $scope.ContactObject.Skin == 1 ? "" : 1;
                break;
            case 2:
                $scope.ContactObject.Skin = $scope.ContactObject.Skin == 2 ? "" : 2;
                break;
            case 3:
                $scope.ContactObject.Skin = $scope.ContactObject.Skin == 3 ? "" : 3;
                break;



        }
        CheckScopeBeforeApply();
    }

    $scope.UpdateHeight = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.Height = $scope.ContactObject.Height == 1 ? "" : 1;
                break;
            case 2:
                $scope.ContactObject.Height = $scope.ContactObject.Height == 2 ? "" : 2;
                break;
            case 3:
                $scope.ContactObject.Height = $scope.ContactObject.Height == 3 ? "" : 3;
                break;



        }
        CheckScopeBeforeApply();
    }

    $scope.UpdateHair = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 1 ? "" : 1;
                break;
            case 2:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 2 ? "" : 2;
                break;
            case 3:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 3 ? "" : 3;
                break;
            case 4:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 4 ? "" : 4;
                break;
            case 5:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 5 ? "" : 5;
                break;
            case 6:
                $scope.ContactObject.Hair = $scope.ContactObject.Hair == 6 ? "" : 6;
                break;

        }
        CheckScopeBeforeApply();
    }
    $scope.GetSelectedClass = function (_G, Type) {
        var _class = "";

        switch (Type) {

            case 1:
                _class = $scope.ContactObject.gender == _G ? "green" : "";
                break;
            case 2:
                _class = $scope.ContactObject.AgeType == _G ? "green" : "";
                break;
            case 3:
                _class = $scope.ContactObject.Hair == _G ? "green" : "";
                break;
            case 4:
                _class = $scope.ContactObject.Skin == _G ? "green" : "";
                break;
            case 5:
                _class = $scope.ContactObject.Height == _G ? "green" : "";
                break;
            default:
                _class = "";

        }

        return _class
    }

    $scope.GetMatches = function () {
        localStorageService.set("ContactSearchObj", $scope.ContactObject);
        $location.path("/SearchData")
    }








    init();






}]);