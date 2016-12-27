'use strict';
app.controller('statusController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.mainObjectToSend = [];
    $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: 0, imagepath: "", Relations: "" };
    $scope.Contacts = [];
    $scope.NewRelation = { Text: "" };
    $scope.NewPlace = { Text: "" };
    $scope.GenderLike = false;
    $scope.RelationsTypeDiv = false;
    $scope.GenderType = true;
    $scope.PlacesType = false;
    $scope.SearchText = "";

    $scope.CurrentActiveClass = "";

    $scope.addupdatename = false;
    $scope.RelationTypes = [{ Type: 1, Text: "Father" },
    { Type: 1, Text: "Brother" }
   ]

    $scope.PlacesTypes = [{ Type: 1, Text: "Place 1" },
   { Type: 1, Text: "Place 2" }
   ]

    
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT)";

    var selectAllStatement = "SELECT * FROM Contacts";

    var insertStatement = "INSERT INTO Contacts (firstName, lastName,email,gender,places,AgeType,imagepath,Relations) VALUES (?, ?,?,?, ?,?,?, ?)";

    var updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?,email=?gender=?,places=?,AgeType=?,imagepath=?,Relations=? WHERE id=?";

    var deleteStatement = "DELETE FROM Contacts WHERE id=?";

    var dropStatement = "DROP TABLE Contacts";

    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database

    var dataset;

    var DataType;


    var mySwiper
    var swiper


    $scope.openNamebox = function () {
        $scope.addupdatename = !$scope.addupdatename;
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

    }

    function insertRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..

    {
        //firstName, lastName, email, places, AgeType, imagepath, Relations

        db.transaction(function (tx) { tx.executeSql(insertStatement, [$scope.ContactObject.firstName, $scope.ContactObject.lastName, $scope.ContactObject.email, $scope.ContactObject.gender, $scope.ContactObject.places, $scope.ContactObject.AgeType, $scope.ContactObject.imagepath, $scope.ContactObject.Relations], loadAndReset, onError); });

        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );

    }

    function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..

    {

        var iddelete = id.toString();

        db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); alert("Delete Sucessfully"); });

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

        $scope.ContactObject = { id: 0, firstName: "", lastName: "", email: "", places: "", AgeType: 0, imagepath: "", Relations: "" };

    }

    function loadAndReset() //Function for Load and Reset...

    {

        resetForm();

        showRecords()

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
                    var _TempObj = { id: (item['id']).toString(), firstName: (item['firstName']).toString(), lastName: (item['lastName']).toString(), email: (item['email']).toString(), gender: (item['gender']), places: (item['places']).toString(), AgeType: (item['AgeType']).toString(), imagepath: (item['imagepath']).toString(), Relations: (item['Relations']).toString() };
                    $scope.Contacts.push(_TempObj);

                }
                CheckScopeBeforeApply();
            });

        });



    }


    $scope.insertRecord = function () {
        insertRecord();
    }


    $scope.EditRecord = function (id) {

    }

    $scope.DeleteRecord = function (id) {
        deleteRecord(id);
    }

    $scope.openDiv=function(Type)
    {
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

    $scope.AddnewToPeople=function()
    {
        debugger;
        var _isAlreadyExist = false;
        for (var i = 0; i < $scope.RelationTypes.length; i++) {
            if ($scope.RelationTypes[i].Text == $.trim($scope.NewRelation.Text))
            {
                _isAlreadyExist = true; break;
            }

        }
        if (_isAlreadyExist == false) {

            $scope.RelationTypes.push({ Type: 1, Text: $scope.NewRelation.Text });
        }
        CheckScopeBeforeApply();
        $("#Addrelation").modal('hide');
      
    }

    $scope.AddnewToPlaces = function () {
        debugger;
        var _isAlreadyExist = false;
        for (var i = 0; i < $scope.PlacesTypes.length; i++) {
            if ($scope.PlacesTypes[i].Text == $.trim($scope.NewPlace.Text)) {
                _isAlreadyExist = true; break;
            }

        }
        if (_isAlreadyExist == false) {

            $scope.PlacesTypes.push({ Type: 1, Text: $scope.NewPlace.Text });
        }

      
        CheckScopeBeforeApply();
        $("#Addplace").modal('hide');
    }

    $scope.openAdd = function () {
        $scope.IsRelationOn = !$scope.IsRelationOn;
        $("#Addrelation").modal('show');
        CheckScopeBeforeApply();
    }

    $scope.openAddPlace = function () {
        $scope.IsPlaceOn = !$scope.IsPlaceOn;
        $("#Addplace").modal('show');
        
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


            }

        });

      //swiper = new Swiper('.swiper-container', {
      //      scrollbar: '.swiper-scrollbar',
      //      scrollbarHide: true,
      //      slidesPerView: 'auto',
      //      centeredSlides: true,
      //      spaceBetween: 30,
      //      grabCursor: true
      //  });

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
                return "Younger than me";
                break;
            case 2:
                return "Same as me";
                break;
            case 3:
                return "Older than me";
                break;
            default:
                return "Same as me";

        }
    }

    $scope.AddtoContactPeople=function(text)
    {
        if($.trim($scope.ContactObject.Relations)!="")
        {
            if ($scope.ContactObject.Relations.indexOf(text) == -1) {

                $scope.ContactObject.Relations = $scope.ContactObject.Relations + "," + text;
            }
        }
        else {
            $scope.ContactObject.Relations = text;
        }

        CheckScopeBeforeApply();
    }

    $scope.AddtoContactPlace = function (text) {
        if ($.trim($scope.ContactObject.places) != "") {
            if ($scope.ContactObject.places.indexOf(text) == -1) {

                $scope.ContactObject.places = $scope.ContactObject.places + "," + text;
            }
        }
        else {
            $scope.ContactObject.places = text;
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

        CheckScopeBeforeApply();

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