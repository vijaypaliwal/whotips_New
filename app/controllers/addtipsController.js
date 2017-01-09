'use strict';
app.controller('addtipsController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.mainObjectToSend = [];
    $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: 0, imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
    $scope.Contacts = [];
    $scope.NewRelation = { Text: "" };
    $scope.NewPlace = { Text: "" };
    $scope.NewTips = { Text: "" }
    $scope.GenderLike = false;
    $scope.RelationsTypeDiv = false;
    $scope.GenderType = true;
    $scope.PlacesType = false;
    $scope.SearchText = "";
    $scope.IsDontknow = false;
    $scope.CurrentActiveClass = "";
    $scope.Connections = [];
    $scope.ContactTips = [];
    $scope.ContactPlaces = [];

    $scope.morehair = false;


    $scope.viewmorehair = function () {
        $scope.morehair = true;
        CheckScopeBeforeApply();
    }

    $scope.lesshair = function () {
        $scope.morehair = false;
        CheckScopeBeforeApply();
    }

    Array.prototype.pushIfNotExist = function (element, comparer) {
        if (!this.inArray(comparer, element)) {
            this.push(element);
        }
    };
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
    function pluckByNameNewFilter(inArr, name, exists, _length) {
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
            _returnVar = true;
        }

        return _returnVar;
    }
    function pluckByNameDefault(inArr, name, exists) {
        if (inArr.length > 0) {

            var i = 0;
            for (i = 0; i < inArr.length; i++) {
                if (inArr[i].Text == name) {
                    console.log(inArr[i]);
                    return (exists === true) ? true : inArr[i];
                }
            }
        }
        else {
            return true;
        }

        return true;
    }

    function pluckByName(inArr, name, exists) {
        if (inArr.length > 0) {

            var i = 0;
            for (i = 0; i < inArr.length; i++) {
                if (inArr[i].Text == name) {
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
    $scope.RecentlyAddedTips = [];
    $scope.$watch('IsDontknow', function () {
        if ($scope.IsDontknow == true) {
            $scope.ContactObject.firstName = "";

        }
        CheckScopeBeforeApply();

    });

    $scope.GetAlphabeticalOrderTips = function () {
        if ($.trim($scope.NewTips.Text) != "") {
            $scope.Tips = [];
             
            var _array = [];
            _array = angular.copy($scope.TipsCopy);
            _array = jQuery.grep(_array, function (el) {
                return el.Text.toLowerCase().indexOf($scope.NewTips.Text.toLowerCase()) > -1;
            });
            $scope.Tips = _array;
            //if (_array != null && _array != undefined && _array != "" && _array.length > 0) {
            //    for (var i = 0; i < _array.length; i++) {


            //        var element = _array[i];
            //        if (pluckByNameNewFilter($scope.Tips, element.Text, false, _array.length)==true) {
            //            $scope.Tips.push(element);
            //        }


            //    }
            //}

        }
        else {
            showRecordTips();
            setTimeout(function () {

                GetTipsArray(1);

            }, 100);
        }

        CheckScopeBeforeApply();

    }

    $scope.addupdatename = false;
    $scope.RelationTypes = []

    $scope.PlacesTypes = []

    $scope.Tips = []
    $scope.TipsCopy = []

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


    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT,Tips TEXT,Hair TEXT,Skin TEXT,Height TEXT)";
    var createStatementTips = "CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, Note TEXT)";
    var selectAllStatement = "SELECT * FROM Contacts";
    var selectAllTipsStatement = "SELECT * FROM Tips ORDER BY Note";

    var insertStatement = "INSERT INTO Contacts (firstName, lastName,email,gender,places,AgeType,imagepath,Relations,Tips,Hair,Skin,Height) VALUES (?, ?,?,?, ?,?,?, ?,?,?, ?,?)";

    var insertStatementTips = "INSERT INTO Tips (Note) VALUES (?)";

    var updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?,email=?,gender=?,places=?,AgeType=?,imagepath=?,Relations=?,Tips=?,Hair=?,Skin=?,Height=? WHERE id=?";

    var deleteStatement = "DELETE FROM Contacts WHERE id=?";

    var dropStatement = "DROP TABLE Contacts";

    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database

    var dataset;

    var DataType;


    var mySwiper
    var swiper
    $("body").on("click", function (e) {

        if ($(e.target).hasClass('modal-backdrop')) {



            $('#AddName').modal('hide');

        }
    });

    $scope.openNamebox = function () {
        $("#AddName").modal('show');
        CheckScopeBeforeApply();
    }

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

        db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, onError); });
        db.transaction(function (tx) { tx.executeSql(createStatementTips, [], showRecordTips, onError); });

        setTimeout(function () {

            GetTipsArray(1);

        }, 500);
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


    function GetSkinCode(_Type) {
        switch (_Type) {
            case "Like Mine" :
                return 1 ;
                break;
            case "Darker Mine":
                return 2 ;
                break;
            case "Lighter Mine":
                return 3;
                break;
            default:
                return "";

        }

    }

    function GetHairsCode(_Type) {
        switch (_Type) {
            case "Bald":
                return 1 ;
                break;
            case "Dark" :
                return 2;
                break;
            case "Brown":
                return 3;
                break;
            case "Blond":
                return 4;
                break;
            case "Red":
                return 5;
                break;
            case  "Grey":
                return 6;
                break;
            default:
                return "";

        }

    }

    function GetHeightCode(_Type) {
        switch (_Type) {
            case  "About My Height":
                return 1;
                break;
            case "Taller Than me":
                return 2;
                break;
            case "Younger Than me":
                return 3;
                break;

            default:
                return "";
        }

    }


    function insertRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..

    {
        //firstName, lastName, email, places, AgeType, imagepath, Relations
        if ($scope.ContactObject.id == 0) {

            if ($.trim($scope.ContactObject.firstName) != "") {

                 

                db.transaction(function (tx) { tx.executeSql(insertStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, "", $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, "", $scope.ContactObject.Tips, GetHairs($scope.ContactObject.Hair), GetSkin($scope.ContactObject.Skin), GetHeight($scope.ContactObject.Height)], loadAndReset, onError); });
            }
            else {
                db.transaction(function (tx) { tx.executeSql(insertStatement, ["Add Name Later", $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, "", $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, "", $scope.ContactObject.Tips, GetHairs($scope.ContactObject.Hair), GetSkin($scope.ContactObject.Skin), GetHeight($scope.ContactObject.Height)], loadAndReset, onError); });

            }
        }
        else {
             

            db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations, $scope.ContactObject.Tips, GetHairs($scope.ContactObject.Hair), GetSkin($scope.ContactObject.Skin), GetHeight($scope.ContactObject.Height), $scope.ContactObject.id], loadAndReset, onError); });
        }

        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );

    }


    function insertRecordTips(value) // Get value from Input and insert record . Function Call when Save/Submit Button Click..

    {



        db.transaction(function (tx) { tx.executeSql(insertStatementTips, [value], showRecordTips, onError); });


        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );

    }

    function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..

    {

        var iddelete = id.toString();

        db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); log.success("Delete Sucessfully"); });

        resetForm();

    }

    function updateRecord() // Get id of record . Function Call when Delete Button Click..

    {



        db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations], loadAndReset, onError); });

    }

    function dropTable() // Function Call when Drop Button Click.. Talbe will be dropped from database.

    {

        db.transaction(function (tx) { tx.executeSql(dropStatement, [], showRecords, onError); });

        resetForm();

        initDatabase();

    }

    function loadRecord(i) // Function for display records which are retrived from database.

    {

        var item = dataset.item(i);



        $scope.ContactObject = { id: (item['id']).toString(), firstName: (item['firstName']).toString(), lastName: (item['lastName']).toString(), email: (item['email']).toString(), gender: (item['gender']).toString(), places: (item['places']).toString(), AgeType: (item['AgeType']).toString(), imagepath: (item['imagepath']).toString(), Relations: (item['Relations']).toString() };
        CheckScopeBeforeApply();
    }

    function resetForm() // Function for reset form input values.

    {

        $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: "", imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
        $scope.IsDontknow = false;
        $scope.Connections = [];
        $scope.ContactTips = [];
        $scope.ContactPlaces = [];
        CheckScopeBeforeApply();
    }

    function loadAndReset() //Function for Load and Reset...

    {


        showRecords();
        if ($scope.ContactObject.id == 0)
        {
            log.success("added successfully");

        }
        else {
            log.success("updated successfully");
        }
        resetForm();

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
                CheckScopeBeforeApply();
                console.log($scope.Contacts);
            });

        });
    }


    function UpdateRecentTips() {
        $scope.RecentlyAddedTips = [];

        var _RecentTips = localStorageService.get("RecentlyAddedTips");



        if ($scope.ContactTips.length > 0) {

            for (var i = 0; i < $scope.ContactTips.length; i++) {

                var element = $scope.ContactTips[i];
                if (pluckByNameNew($scope.RecentlyAddedTips, element.Text, false, $scope.ContactTips.length) == false) {
                    $scope.RecentlyAddedTips.push(element);
                }
            }
        }


        if (_RecentTips != null && _RecentTips != undefined && _RecentTips != "" && _RecentTips.length > 0) {
            for (var i = 0; i < _RecentTips.length; i++) {

                var element = _RecentTips[i];
                if (pluckByNameNew($scope.RecentlyAddedTips, element.Text, false, _RecentTips.length) == false) {
                    $scope.RecentlyAddedTips.push(element);
                }


            }
        }

        CheckScopeBeforeApply();

        localStorageService.set("RecentlyAddedTips", $scope.RecentlyAddedTips);

    }

    function showRecordTips() // Function For Retrive data from Database Display records as list

    {

        $scope.Tips = [];
        $scope.TipsCopy = [];
        db.transaction(function (tx) {
            tx.executeSql(selectAllTipsStatement, [], function (tx, result) {
                dataset = result.rows;
                for (var i = 0, item = null; i < dataset.length; i++) {

                    item = dataset.item(i);
                    var _TempObj = { id: (item['id']).toString(), Text: (item['Note']).toString() };
                    $scope.Tips.push(_TempObj);

                    $scope.TipsCopy.push(_TempObj);

                }
                CheckScopeBeforeApply();
            });

        });

    }




    $scope.insertRecord = function () {

        insertRecord();

        UpdateRecentTips();
        createTable();
        $location.path("/menu")
    }



    $scope.ClearSearchText = function () {
        $scope.SearchText = "";
        CheckScopeBeforeApply();
        $scope.CallShowDetail();
    }
    $scope.EditRecord = function (id) {

    }


    $scope.IsAvailable = function (Type, text) {

        //$scope.Connections = [];
        //$scope.ContactTips = [];
        //$scope.ContactPlaces = [];

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

    $scope.GetColorClass = function (_G) {
        var _class = _G == "F" ? "femaleColor" : "maleColor";
        return _class
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

    $scope.GetBGColorClass = function (_G) {
        var _class = _G == "F" ? "femaleBGColor" : "maleBGColor";
        return _class
    }




    $scope.DeleteRecord = function (id) {
         
        var _confirm = confirm("Are you sure to remove this contact?");
        if (_confirm) {

            deleteRecord(id);
        }
    }

    $scope.FilterByType = function (_type, _array) {
        switch (_type) {
            case 1:

                _array = jQuery.grep(_array, function (el) {
                    return el.gender == $scope.ContactObject.gender;
                });
                break;
            case 2:

                _array = jQuery.grep(_array, function (el) {
                    return el.places.indexOf($scope.ContactObject.places) !== -1;
                });
                break;
            case 3:

                _array = jQuery.grep(_array, function (el) {
                    return el.Relations.indexOf($scope.ContactObject.Relations) !== -1;
                });
                break;

            case 4:

                _array = jQuery.grep(_array, function (el) {
                    return el.AgeType == $scope.ContactObject.AgeType;
                });
                break;


            default:

        }

        return _array;
    }


    $scope.viewallrelation = function () {
        $("#Allrelation").modal('show');
    }

    $scope.viewallplaces = function () {
        $("#Allplaces").modal('show');
    }

    $scope.GetFiltered = function (_array) {
        var _TempArray = [];
        var _isChanged = false;
        var _TempArray2 = _array;
        for (var i = 0; i < _array.length; i++) {
            var _isGender = false;
            var _isplaces = false;
            var _isRelations = false;
            if ($.trim($scope.ContactObject.gender) != "") {
                if (_array[i].gender == $scope.ContactObject.gender) {
                    _isChanged = true;
                    _TempArray2 = $scope.FilterByType(1, _TempArray2);


                }
            }
            if ($.trim($scope.ContactObject.places) != "") {

                if (_array[i].places.indexOf($scope.ContactObject.places) !== -1) {
                    _isChanged = true;
                    _TempArray2 = $scope.FilterByType(2, _TempArray2);
                }

            }

            if ($.trim($scope.ContactObject.Relations) != "") {

                if (_array[i].Relations.indexOf($scope.ContactObject.Relations) !== -1) {
                    _isChanged = true;
                    _TempArray2 = $scope.FilterByType(3, _TempArray2);

                }

            }

            if ($.trim($scope.ContactObject.AgeType) != "") {

                if (_array[i].AgeType == $scope.ContactObject.AgeType) {
                    _isChanged = true;
                    _TempArray2 = $scope.FilterByType(4, _TempArray2);

                }

            }

        }

        _TempArray = _isChanged == true ? _TempArray2 : _array;
        return _TempArray;
    }

    $scope.openDiv = function (Type) {
        switch (Type) {
            case 1:
                $scope.GenderLike = false;
                $scope.RelationsTypeDiv = false;
                $scope.GenderType = true;
                $scope.PlacesType = false;
                break;
            case 2:
                $scope.GenderLike = true;
                $scope.RelationsTypeDiv = false;
                $scope.GenderType = false;
                $scope.PlacesType = false;
                break;
            case 3:
                $scope.GenderLike = false;
                $scope.RelationsTypeDiv = true;
                $scope.GenderType = false;
                $scope.PlacesType = false;
                break;
            case 4:
                $scope.GenderLike = false;
                $scope.RelationsTypeDiv = false;
                $scope.GenderType = false;
                $scope.PlacesType = true;
                break;
            default:

        }
        CheckScopeBeforeApply();
    }
    $scope.GotoIndex = function (index) {
        $scope.CurrentActiveClass = index;
        mySwiper.swipeTo(index, 1000, false);
        CheckScopeBeforeApply();
    }
    $scope.AddnewToPeople = function () {

        if ($.trim($scope.NewRelation.Text) != "") {

            var _isAlreadyExist = false;
            for (var i = 0; i < $scope.RelationTypes.length; i++) {
                if ($scope.RelationTypes[i].Text == $.trim($scope.NewRelation.Text)) {
                    _isAlreadyExist = true; break;
                }

            }
            if (_isAlreadyExist == false) {

                $scope.RelationTypes.push({ Type: 1, Text: $scope.NewRelation.Text });
                $scope.NewRelation.Text = "";
            }

            CheckScopeBeforeApply();
            $scope.receltyadded = $scope.RelationTypes.length;

            setTimeout(function () {
                $("." + $scope.receltyadded).addClass("animated bounce");
            }, 500)



        }



        else {

            log.error("Enter some value");

        }

    }

    $scope.AddnewToPlaces = function () {

        if ($.trim($scope.NewPlace.Text) != "") {

            var _isAlreadyExist = false;
            for (var i = 0; i < $scope.PlacesTypes.length; i++) {
                if ($scope.PlacesTypes[i].Text == $.trim($scope.NewPlace.Text)) {
                    _isAlreadyExist = true; break;
                }

            }
            if (_isAlreadyExist == false) {

                $scope.PlacesTypes.push({ Type: 1, Text: $scope.NewPlace.Text });
                $scope.NewPlace.Text = "";
            }


            CheckScopeBeforeApply();
            $("#Addplace").modal('hide');
            $scope.receltyadded = $scope.PlacesTypes.length;

            setTimeout(function () {
                $("." + $scope.receltyadded).addClass("animated bounce");
            }, 500)
        }
        else {
            log.error("Enter some value");
        }
    }


    $scope.AddnewToTips = function () {

        if ($.trim($scope.NewTips.Text) != "") {

            var _isAlreadyExist = false;
            for (var i = 0; i < $scope.Tips.length; i++) {
                if ($scope.Tips[i].Text == $.trim($scope.NewTips.Text)) {
                    _isAlreadyExist = true;
                    break;
                }

            }
            if (_isAlreadyExist == false) {

                //$scope.Tips.push({ Type: 1, Text: $scope.NewTips.Text });
                insertRecordTips($scope.NewTips.Text);
                $scope.NewTips.Text = "";
            }

            CheckScopeBeforeApply();

        }
        else {
            log.error("Enter some value");
        }
    }

    $scope.openAdd = function () {
        $scope.IsRelationOn = !$scope.IsRelationOn;
        $("#Addrelation").modal('show');
        $scope.NewRelation.Text = "";
        CheckScopeBeforeApply();
    }

    $scope.openAddPlace = function () {
        $scope.IsPlaceOn = !$scope.IsPlaceOn;
        $("#Addplace").modal('show');
        $scope.NewPlace.Text = "";
        CheckScopeBeforeApply();
    }
    function init() {


        var _EditObject = localStorageService.get("EditContactSearchObj");

        if (_EditObject != null && _EditObject != undefined) {

            $scope.ContactObject = { id: _EditObject.id, firstName: _EditObject.firstName, lastName: _EditObject.lastName, email: "", gender: _EditObject.gender, places: "", AgeType: _EditObject.AgeType, imagepath: _EditObject.imagepath, Relations: "", Tips: _EditObject.Tips, Hair: GetHairsCode(_EditObject.Hair), Skin: GetSkinCode(_EditObject.Skin), Height: GetHeightCode(_EditObject.Height) };
            if (_EditObject.Tips != null && _EditObject.Tips != undefined && $.trim(_EditObject.Tips) != "") {

                var _Data = _EditObject.Tips.split(",");
                for (var i = 0; i < _Data.length; i++) {

                    $scope.ContactTips.push({ id: 1 + Math.floor(Math.random() * 100), Text: _Data[i] });
                }
            }
        }
        initDatabase();

        $("#NameBox").focusin(function () {
            $(this).attr("Placeholder", "");
        }).focusout(function () {
            $(this).attr("Placeholder", "Name");
        });

        mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            speed: 500,
            effect: 'flip',
            allowSwipeToPrev: false,
            onSlideChangeEnd: function (swiperHere) {


                $scope.CurrentActiveClass = swiperHere.activeIndex;
                CheckScopeBeforeApply();
                if (swiperHere.activeIndex == 5) {
                    $("#firstname").focus();
                }
                //  $cordovaKeyboard.hideAccessoryBar(false);
                $cordovaKeyboard.disableScroll(true);
                CheckScopeBeforeApply();


            },
            //pagination: '.swiper-pagination',
            //paginationClickable: true,
            //nextButton: '.swiper-button-next',
            //prevButton: '.swiper-button-prev',

        });
        setTimeout(function () {
            swiper = new Swiper('.swiper-container1', {
                scrollbar: '.swiper-scrollbar',
                scrollbarHide: false,
                slidesPerView: 'auto',
                centeredSlides: false,
                spaceBetween: 100,
                grabCursor: true
            });
        }, 1000);


        //setTimeout(function () {

        //    $(".genderrow").removeClass("hide");
        //    $(".genderrow").addClass("animated fadeInUp");

        //}, 500);

        //setTimeout(function () {

        //    $(".agerow").removeClass("hide");
        //    $(".agerow").addClass("animated fadeInUp");

        //}, 800)

        //setTimeout(function () {

        //    $(".skinrow").removeClass("hide");
        //    $(".skinrow").addClass("animated fadeInUp");
        //    $(".tiparea").removeClass("animated");
        //    $(".tiparea").removeClass("bounceInDown");



        //}, 1100)

        //setTimeout(function () {

        //    $(".heightrow").removeClass("hide");
        //    $(".heightrow").addClass("animated fadeInUp");

        //}, 1400)

        //setTimeout(function () {

        //    $(".hairrow").removeClass("hide");
        //    $(".hairrow").addClass("animated fadeInUp");

        //}, 1700);

        //setTimeout(function () {

        //    $(".bottomarea").removeClass("hide");
        //    $(".bottomarea").addClass("animated bounceInDown");

        //}, 2000);






        CheckScopeBeforeApply();
    }


    function GetTipsArray(type) {
        $scope.RecentlyAddedTips = [];
        var _RecentTips = localStorageService.get("RecentlyAddedTips");

        if (_RecentTips != null && _RecentTips != undefined && _RecentTips != "" && _RecentTips.length > 0) {
            for (var i = 0; i < _RecentTips.length; i++) {

                var element = _RecentTips[i];
                if (pluckByNameNew($scope.RecentlyAddedTips, element.Text, true, _RecentTips.length) == false) {
                    $scope.RecentlyAddedTips.push(element);
                }


            }
        }
        CheckScopeBeforeApply();
        var _TipsData = angular.copy($scope.Tips);
        var _TempData = [];

        if (type == 1) {
            for (var i = 0; i < $scope.RecentlyAddedTips.length; i++) {

                var element = $scope.RecentlyAddedTips[i];



                if (pluckByNameNew(_TempData, element.Text, true, $scope.RecentlyAddedTips.length) == false) {
                    _TempData.push(element);
                }

            }
            for (var i = 0; i < _TipsData.length; i++) {
                var element = _TipsData[i];


                if (pluckByNameNew(_TempData, element.Text, false, _TipsData.length) == false) {
                    _TempData.push(element);
                }


            }

        }

        $scope.Tips = type == 1 ? angular.copy(_TempData) : angular.copy(_TipsData);
        CheckScopeBeforeApply();
    }

    $scope.GoToNext = function () {
        mySwiper.swipeNext();
    }
    $scope.GoToPrev = function () {
        mySwiper.swipePrev();
    }


    $scope.getHairImage = function (Hair) {
        switch (Hair) {
            case "Bald":
                return "bald.png";
                break;
            case "Dark":
                return "dark.png";
                break;
            case "Brown":
                return "brown.png";
                break;
            case "Blond":
                return "blond.png";
                break;
            case "Red":
                return "red.png";
                break;
            case "Grey":
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
    $scope.CallShowDetail = function () {
        //applyshowdetail();
    }
    $scope.GetSkinClass = function (Type) {
        switch (Type) {
            case "Like Mine":
                return "mine";
                break;
            case "Darker Mine":
                return "darkmine";
                break;
            case "Lighter Mine":
                return "lightmine";
                break;
            default:

        }
        return "";
    }

    $scope.viewallTips = function () {
        $("#AllTips").modal('show');
    }

    $scope.AddtoContactPeople = function (text) {


        if ($.trim($scope.ContactObject.Relations) != "") {


            if ($scope.ContactObject.Relations.indexOf(text) == -1) {

                $scope.ContactObject.Relations = $scope.ContactObject.Relations + "," + text;
                $scope.Connections.push(text);
            }

            else {
                var y = angular.copy($scope.Connections);
                y = jQuery.grep(y, function (value) {
                    return value != text;
                });

                $scope.Connections = angular.copy(y);
                $scope.ContactObject.Relations = $scope.Connections.join(", ");
            }
        }
        else {
            $scope.ContactObject.Relations = text;
            $scope.Connections.push(text);
        }

        CheckScopeBeforeApply();
    }

    $scope.AddtoContactPlace = function (text) {
        if ($.trim($scope.ContactObject.places) != "") {
            if ($scope.ContactObject.places.indexOf(text) == -1) {

                $scope.ContactObject.places = $scope.ContactObject.places + "," + text;
                $scope.ContactPlaces.push(text);
            }

            else {

                var y = angular.copy($scope.ContactPlaces);
                y = jQuery.grep(y, function (value) {
                    return value != text;
                });

                $scope.ContactPlaces = angular.copy(y);
                $scope.ContactObject.places = $scope.ContactPlaces.join(", ");
            }
        }
        else {
            $scope.ContactObject.places = text;

            $scope.ContactPlaces.push(text);
        }

        CheckScopeBeforeApply();
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

        CheckScopeBeforeApply();
    }
    function SearchText(name, callback) {
            var data = $scope.ContactObject.Tips.split(",");
            var contains = (data.indexOf(name) > -1);
            callback(contains);

        return;


    }



    $scope.gotonext = function (Type) {
        $scope.ContactObject.gender = Type;



        $scope.GoToNext();



        setTimeout(function () {
            $(".gender").addClass("animated fadeIn");
        }, 10);

        $(".gender").addClass("animated fadeIn");

        setTimeout(function () {
            $(".gender").removeClass("animated");
            $(".gender").removeClass("fadeIn");
        }, 1000);

        CheckScopeBeforeApply();



    }

    $scope.onPhotoDataSuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        $scope.ContactObject.imagepath = imageData;

        CheckScopeBeforeApply();
        $("#AddName").modal('hide');
        // log.success("Images captured length"+$scope.ImageList.length);

    }

    $scope.onFail = function (message) {

        log.error('Failed because: ' + message);
    }
    $scope.capturePhotoNew = function () {
        navigator.camera.getPicture($scope.onPhotoDataSuccessNew, $scope.onFail, {
            quality: 50,
            targetWidth: 120,
            targeHeight: 120,
            correctOrientation: true,
            destinationType: destinationType.DATA_URL,
            allowEdit: true,
            saveToPhotoAlbum: true,
        });
    }


    $scope.onPhotoURISuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        $scope.ContactObject.imagepath = imageData;

        CheckScopeBeforeApply();
        $("#AddName").modal('hide');
    }

    $scope.getPhoto = function (source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture($scope.onPhotoURISuccessNew, $scope.onFail, {
            quality: 50,
            correctOrientation: true,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });



    }

    $scope.keepformopen = function (check) {


        $scope.check = check;
        CheckScopeBeforeApply();
    }

    init();



    $scope.addrealtion = function () {
        $("#Addrelation").modal('show');
    }


}]);