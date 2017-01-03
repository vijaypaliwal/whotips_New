'use strict';
app.controller('addtipsController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.mainObjectToSend = [];
    $scope.ContactObject = { id: 0, firstName: "Add Name Later", lastName: "", email: "", gender: "", places: "", AgeType: 0, imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
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
    $scope.$watch('IsDontknow', function () {
        if ($scope.IsDontknow == true) {
            $scope.ContactObject.firstName = "";

        }
        CheckScopeBeforeApply();

    });

    $scope.addupdatename = false;
    $scope.RelationTypes = []

    $scope.PlacesTypes = []

    $scope.Tips = []

   
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.UpdateGender = function (Type) {
        switch (Type) {
            case 1:
                $scope.ContactObject.gender = "M";
                break;
            case 2:
                $scope.ContactObject.gender = "F";
                break;
            default:
                $scope.ContactObject.gender = "N";


        }
        CheckScopeBeforeApply();
    }


    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT,Tips TEXT,Hair TEXT,Skin TEXT,Height TEXT)";
    var createStatementTips = "CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, Note TEXT)";
    var selectAllStatement = "SELECT * FROM Contacts";
    var selectAllTipsStatement = "SELECT * FROM Tips ORDER BY Note";

    var insertStatement = "INSERT INTO Contacts (firstName, lastName,email,gender,places,AgeType,imagepath,Relations,Tips,Hair,Skin,Height) VALUES (?, ?,?,?, ?,?,?, ?,?,?, ?,?)";

    var insertStatementTips = "INSERT INTO Tips (Note) VALUES (?)";

    var updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?,email=?gender=?,places=?,AgeType=?,imagepath=?,Relations=? WHERE id=?";

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
    }

    function GetSkin(_Type)
    {
        switch (_Type) {
            case 0:
                return "Like Mine";
                break;
            case 1:
                return "Darker Mine";
                break;
            case 2:
                return "Lighter Mine";
                break;
            default:
                return "";

        }

    }

    function GetHairs(_Type) {
        switch (_Type) {
            case 0:
                return "Bald";
                break;
            case 1:
                return "Dark";
                break;
            case 2:
                return "Brown";
                break;
            case 3:
                return "Blond";
                break;
            case 4:
                return "Red";
                break;
            case 5:
                return "Grey";
                break;
            default:
                return "";

        }

    }

    function GetHeight(_Type) {
        switch (_Type) {
            case 0:
                return "About My Height";
                break;
            case 1:
                return "Taller Than me";
                break;
            case 2:
                return "Younger Than me";
                break;
            
            default:
                return "";
        }

    }


    function insertRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..

    {
        //firstName, lastName, email, places, AgeType, imagepath, Relations
        if ($scope.IsDontknow == false) {


            db.transaction(function (tx) { tx.executeSql(insertStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations, $scope.ContactObject.Tips, GetHairs($scope.ContactObject.Hair), GetSkin($scope.ContactObject.Skin), GetHeight($scope.ContactObject.Height)], loadAndReset, onError); });
        }
        else {
            db.transaction(function (tx) { tx.executeSql(insertStatement, ["N/A", $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations, $scope.ContactObject.Tips, $scope.ContactObject.Hair, $scope.ContactObject.Skin, $scope.ContactObject.Height], loadAndReset, onError); });

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

        $scope.ContactObject = { id: 0, firstName: "Add Name Later", lastName: "", email: "", gender: "", places: "", AgeType: 0, imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
        $scope.IsDontknow = false;
        $scope.Connections = [];
        $scope.ContactTips = [];
        $scope.ContactPlaces = [];
        CheckScopeBeforeApply();
    }

    function loadAndReset() //Function for Load and Reset...

    {

        resetForm();

        showRecords();
        log.success("added successfully");

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
            });

        });
    }


    function showRecordTips() // Function For Retrive data from Database Display records as list

    {

        $scope.Tips = [];
        db.transaction(function (tx) {

            tx.executeSql(selectAllTipsStatement, [], function (tx, result) {
                dataset = result.rows;
                debugger;
                for (var i = 0, item = null; i < dataset.length; i++) {

                    item = dataset.item(i);
                    var _TempObj = { id: (item['id']).toString(), Text: (item['Note']).toString() };
                    $scope.Tips.push(_TempObj);

                }
                CheckScopeBeforeApply();
            });

        });
    }



    $scope.insertRecord = function () {
     
            insertRecord();


    }

    $scope.ClearSearchText = function () {
        $scope.SearchText = "";
        CheckScopeBeforeApply();
    }
    $scope.EditRecord = function (id) {

    }


    $scope.IsAvailable = function (Type, text) {

        //$scope.Connections = [];
        //$scope.ContactTips = [];
        //$scope.ContactPlaces = [];
        debugger;
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
                    if ($scope.ContactTips[i] == text) {
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
        var _class =  "";
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

        }
        
        return _class
    }

    $scope.GetBGColorClass = function (_G) {
        var _class = _G == "F" ? "femaleBGColor" : "maleBGColor";
        return _class
    }




    $scope.DeleteRecord = function (id) {
        deleteRecord(id);
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
        debugger;
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
        debugger;
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
        debugger;
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



        initDatabase();



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


        CheckScopeBeforeApply();
    }
    $scope.GoToNext = function () {
        mySwiper.swipeNext();
    }
    $scope.GoToPrev = function () {
        mySwiper.swipePrev();
    }

    $scope.GetAgeType = function (Type) {
        switch (Type) {
            case 1:
                return "Much Younger than Me";
                break;
            case 2:
                return "My Generation";
                break;
            case 3:
                return "Much Older than me";
                break;
            default:
                return "Relative Age";

        }
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
        debugger;
        if ($.trim($scope.ContactObject.Tips) != "") {
            if ($scope.ContactObject.Tips.indexOf(text) == -1) {

                $scope.ContactObject.Tips = $scope.ContactObject.Tips + "," + text;
                $scope.ContactTips.push(text);
            }



            else {

                var y = angular.copy($scope.ContactTips);
                y = jQuery.grep(y, function (value) {
                    return value != text;
                });

                $scope.ContactTips = angular.copy(y);
                $scope.ContactObject.Tips = $scope.ContactTips.join(", ");
            }
        }
        else {
            $scope.ContactObject.Tips = text;
            $scope.ContactTips.push(text);
        }

        CheckScopeBeforeApply();
    }



    $scope.UpdateAgeType = function (Type) {
        $scope.ContactObject.AgeType = Type;
        CheckScopeBeforeApply();
        $scope.GoToNext();

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