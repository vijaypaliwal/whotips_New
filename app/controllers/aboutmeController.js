'use strict';
app.controller('aboutmeController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.MyContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: "", imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
    $scope.NewTips = { Text: "" };
    var createStatement = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT,lastName TEXT, email TEXT,gender integer,places TEXT,AgeType integer,imagepath TEXT,Relations TEXT,Tips TEXT,Hair TEXT,Skin TEXT,Height TEXT)";
    var createStatementTips = "CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, Note TEXT)";
    var selectAllStatement = "SELECT * FROM Contacts";
    var selectAllTipsStatement = "SELECT * FROM Tips ORDER BY Note";
    var deleteStatement = "DELETE FROM Contacts WHERE id=?";
    $scope.Tips = [];
    $scope.TipsCopy = [];
    $scope.Contacts = [];
    $scope.IsEditMode = false;
    $scope.NameText = { Text: "" };
    $scope.ContactsCopy = [];
    $scope.ContactsFilteredCopy = [];
    $scope.ContactTips = [];
    $scope.ContactTipsFilter = [];
    var db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);  // Open SQLite Database

    var _DefaultPath = "Emoji"

    $scope.isgender = "Male";

    $scope.PhysicalImages = { age1: _DefaultPath + "/defaultMale/generation/MaleMyAge.svg", age2: _DefaultPath + "/defaultMale/generation/MaleYounger.svg", age3: _DefaultPath + "/defaultMale/generation/MaleOlder.svg", skin1: "", skin2: "", skin3: "", height1: "", height2: "", height3: "", hair1: "", hair2: "", hair3: "", hair4: "", hair5: "", hair6: "" }

    $scope.SelectedMyContactObject = {};
    var dataset;

    $scope.showgender = false;

    var DataType;


    $scope.ToggleEdit = function () {
        $scope.IsEditMode = !$scope.IsEditMode;
        CheckScopeBeforeApply();

    }

    var _InsertDatasql = "";
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
        alert("into import data");
        ReadData();
        
       
    }


    function ReadData()
    {
        alert("into read data");
        var path = "Backup.txt";
        //window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+path, gotFile, fail);
        //fileSystem.root.getFile(cordova.file.documentsDirectory + path, { create: false, exclusive: false }, gotFile, fail);


        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            alert('file system open: ' + fs.name);
            fs.root.getFile(path, { create: true, exclusive: false }, function (fileEntry) {

                gotFile(fileEntry);

            }, null);

        }, null);
    }

    function fail(e) {
        console.log("FileSystem Error");
        console.dir(e);
    }

    function gotFile(fileEntry) {
        alert("into got file");
        fileEntry.file(function (file) {
            alert("File size" + file.size);
            alert("Name" + file.name);

            alert("Full path"+file.fullPath);

            var reader = new FileReader();
            reader.onloadstart=function(e)
            {
                alert("reader start");
            }
            reader.onload = function (e) {
                alert("reader loaded");
            }
            reader.onloadend = function (e) {
                console.log("Text is: " + this.result);

                alert("read!");
                alert(e.target.result);
               
                _InsertDatasql = e.target.result;
                alert("query Data");
                alert(_InsertDatasql);

                cordova.plugins.sqlitePorter.importSqlToDb(db, _InsertDatasql, {
                    successFn: successFn,
                    errorFn: errorFn,
                    progressFn: progressFn
                });
            }

            reader.readAsText(file);
        });

        
    }

    function WriteFileData() {
        alert("write file data");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    }

    function gotFS(fileSystem) {
        alert("file system");
        var path = "Backup.txt";
        //fileSystem.root.getFile(cordova.file.documentsDirectory + path, { create: true, exclusive: false }, gotFileEntry, fail);


        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            alert('file system open: ' + fs.name);
            fs.root.getFile( path, { create: true, exclusive: false }, function (fileEntry) {

                gotFileEntry(fileEntry);

            }, null);

        }, null);
    }

    function gotFileEntry(fileEntry) {
        alert("into file entry");
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwritestart = function (evt) {
            alert("on start");
            alert(writer.length);
        };
        writer.onwriteend = function (evt) {
            alert("on end");
            alert(writer.length);
        };
        writer.onwrite = function (evt) {
            alert("write success");
            alert(_InsertDatasql);
        };
        writer.write(_InsertDatasql);

        //cordova.plugins.email.open({
        //    to: ["gautam.p@shivamitconsultancy.com"], // email addresses for TO field
        //    attachments: ["Backup.txt"], // file paths or base64 data streams
        //    subject: "test Backup Email", // subject of the email
        //    body: "This is just test", // email body (for HTML, set isHtml to true)
        //    isHtml: false, // indicats if the body is HTML or plain text
        //}, alert("mail Sent"), null);
    }

    var successFnEx = function (sql, count) {

        var _stringdata = "DROP TABLE IF EXISTS `sqlite_sequence`;";
        var _s1 = "CREATE TABLE sqlite_sequence(name,seq);";

        sql = sql.replace(_stringdata, "")
        sql = sql.replace(_s1, "")
        _InsertDatasql = sql;
        WriteFileData();

        $scope.RemoveDb();

      
    };
    function ExportData() {


        cordova.plugins.sqlitePorter.exportDbToSql(db, {
            successFn: successFnEx
        });
    }


    $scope.ExportDb = function () {
        ExportData();
    }
    $scope.ImportDb = function () {
        ImportData();
    }

    var _genderFolder = "/defaultMale";
    var _gen = "/generation";
    var _skin = "/skin";
    var _hair = "/hair";
    var _height = "/height";
    var _fileName = "/Male";

    $scope.$watch('MyContactObject.gender', function (oldValue, newValue) {
        
        if (oldValue == "M") {
            _fileName = "/Male";
            _genderFolder = "/defaultMale";

        }
        else if (oldValue == "F") {
            _genderFolder = "/defaultFemale";
            _fileName = "/Female";



        }
        var _agePath = _DefaultPath + _genderFolder + _gen + _fileName;
        var _skinPath = _DefaultPath + _genderFolder + _skin + _fileName;
        var _heightPath = _DefaultPath + _genderFolder + _height + _fileName;
        var _hairPath = _DefaultPath + _genderFolder + _hair + _fileName;
        $scope.PhysicalImages = {
            age1: _agePath + "MyAge.svg",
            age2: _agePath + "Younger.svg",
            age3: _agePath + "Older.svg",
            skin1: _skinPath + "lighter.svg",
            skin2: _skinPath+"Mycolor.svg",
            skin3: _skinPath + "darker.svg",
            height1: _heightPath + "Shorter.svg",
            height2: _heightPath + "MyHeight.svg",
            height3: _heightPath + "Taller.svg",
            hair1: _hairPath+"bald.svg",
            hair2: _hairPath+"black.svg",
            hair3: _hairPath + "brown.svg",
            hair4: _hairPath + "blond.svg",
            hair5: _hairPath + "red.svg",
            hair6: _hairPath + "grey.svg"
        }

        if ($scope.MyContactObject.AgeType != "") {

            UpdateAgeTypeImages();
        }
        if ($scope.MyContactObject.Skin != "") {

            UpdateSkinTypeImages();
        }
  
        CheckScopeBeforeApply();

    });
    $scope.$watch('MyContactObject.AgeType', function (oldValue, newValue) {
        _genderFolder = $scope.MyContactObject.gender == "F" ? "/defaultFemale" : "/defaultMale";
        _fileName = $scope.MyContactObject.gender == "F" ? "/Female" : "/Male";
        
        if ($scope.MyContactObject.AgeType != "") {

            UpdateAgeTypeImages();
        }
        if ($scope.MyContactObject.Skin != "") {

            UpdateSkinTypeImages();
        }
        CheckScopeBeforeApply();

    });
    function UpdateSkinTypeImages() {
        var _SkinTypeFolder = "";
        
        if ($scope.MyContactObject.Skin == 1) {
            _SkinTypeFolder = "/Myskin";

        }
        else if ($scope.MyContactObject.Skin == 2) {

            _SkinTypeFolder = "/Darkerskin";

        }
        else if ($scope.MyContactObject.Skin == 3) {

            _SkinTypeFolder = "/Lighterskin";


        }
        var _agePath = _DefaultPath + _genderFolder + _gen + _fileName;
        var _skinPath = _DefaultPath + _genderFolder + _skin + _fileName;
        var _hairPath = $scope.MyContactObject.Skin == "" || _SkinTypeFolder == "" ? (_DefaultPath + _genderFolder + _hair + _fileName) : (_DefaultPath + _genderFolder + _skin + _SkinTypeFolder + _hair + _fileName);
        var _heightPath = $scope.MyContactObject.Skin == "" || _SkinTypeFolder == "" ? (_DefaultPath + _genderFolder + _height + _fileName) : (_DefaultPath + _genderFolder + _skin + _SkinTypeFolder + _height + _fileName);

        $scope.PhysicalImages = {
            age1: _agePath + "MyAge.svg",
            age2: _agePath + "Younger.svg",
            age3: _agePath + "Older.svg",
            skin1: _skinPath + "lighter.svg",
            skin2: _skinPath + "Mycolor.svg",
            skin3: _skinPath + "darker.svg",
            height1: _heightPath + "Shorter.svg",
            height2: _heightPath + "MyHeight.svg",
            height3: _heightPath + "Taller.svg",
            hair1: _hairPath + "bald.svg",
            hair2: _hairPath + "black.svg",
            hair3: _hairPath + "brown.svg",
            hair4: _hairPath + "blond.svg",
            hair5: _hairPath + "red.svg",
            hair6: _hairPath + "grey.svg"
        }
    }
    function UpdateAgeTypeImages()
    {
        var _GeneTypeFolder = "";
        if ($scope.MyContactObject.AgeType == 1) {
            _GeneTypeFolder = "/Mygeneration";

        }
        else if ($scope.MyContactObject.AgeType == 2) {

            _GeneTypeFolder = "/YoungerGeneration";

        }
        else if ($scope.MyContactObject.AgeType == 3) {

            _GeneTypeFolder = "/OlderGeneration";

        }
        var _agePath = _DefaultPath + _genderFolder + _gen + _fileName;
        var _skinPath = $scope.MyContactObject.AgeType == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _skin + _fileName) : (_DefaultPath + _genderFolder + _gen + _GeneTypeFolder + _skin + _fileName);
        var _hairPath = $scope.MyContactObject.AgeType == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _hair + _fileName) : (_DefaultPath + _genderFolder + _gen + _GeneTypeFolder + _hair + _fileName);
        var _heightPath = $scope.MyContactObject.AgeType == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _height + _fileName) : (_DefaultPath + _genderFolder + _gen + _GeneTypeFolder + _height + _fileName);

        $scope.PhysicalImages = {
            age1: _agePath + "MyAge.svg",
            age2: _agePath + "Younger.svg",
            age3: _agePath + "Older.svg",
            skin1: _skinPath + "lighter.svg",
            skin2: _skinPath + "Mycolor.svg",
            skin3: _skinPath + "darker.svg",
            height1: _heightPath + "Shorter.svg",
            height2: _heightPath + "MyHeight.svg",
            height3: _heightPath + "Taller.svg",
            hair1: _hairPath + "bald.svg",
            hair2: _hairPath + "black.svg",
            hair3: _hairPath + "brown.svg",
            hair4: _hairPath + "blond.svg",
            hair5: _hairPath + "red.svg",
            hair6: _hairPath + "grey.svg"
        }

    }
    function UpdateHairTypeImages() {
        var _GeneTypeFolder = "";
        if ($scope.MyContactObject.Hair == 1) {
            _GeneTypeFolder = "/bald";

        }
        else if ($scope.MyContactObject.Hair == 2) {

            _GeneTypeFolder = "/dark";

        }
        else if ($scope.MyContactObject.Hair == 3) {

            _GeneTypeFolder = "/brown";

        }
        else if ($scope.MyContactObject.Hair == 4) {
            _GeneTypeFolder = "/blond";

        }
        else if ($scope.MyContactObject.Hair == 5) {

            _GeneTypeFolder = "/red";

        }
        else if ($scope.MyContactObject.Hair == 6) {

            _GeneTypeFolder = "/grey";

        }
        var _agePath = _DefaultPath + _genderFolder + _height + _fileName;
        var _skinPath = $scope.MyContactObject.Height == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _skin + _fileName) : (_DefaultPath + _genderFolder + _hair + _GeneTypeFolder +  _fileName);
        var _hairPath = $scope.MyContactObject.Height == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _hair + _fileName) : (_DefaultPath + _genderFolder + _hair + _GeneTypeFolder + _fileName);
        var _heightPath = $scope.MyContactObject.Height == "" || _GeneTypeFolder == "" ? (_DefaultPath + _genderFolder + _height + _fileName) : (_DefaultPath + _genderFolder + _hair + _GeneTypeFolder +  _fileName);

        $scope.PhysicalImages = {
            age1: _agePath + "MyAge.svg",
            age2: _agePath + "Younger.svg",
            age3: _agePath + "Older.svg",
            skin1: _skinPath + "lighter.svg",
            skin2: _skinPath + "Mycolor.svg",
            skin3: _skinPath + "darker.svg",
            height1: _heightPath + "Shorter.svg",
            height2: _heightPath + "MyHeight.svg",
            height3: _heightPath + "Taller.svg",
            hair1: _hairPath + "bald.svg",
            hair2: _hairPath + "black.svg",
            hair3: _hairPath + "brown.svg",
            hair4: _hairPath + "blond.svg",
            hair5: _hairPath + "red.svg",
            hair6: _hairPath + "grey.svg"
        }

    }

    $scope.$watch('MyContactObject.Hair', function (oldValue, newValue) {
        _genderFolder = $scope.MyContactObject.gender == "F" ? "/defaultFemale" : "/defaultMale";
        _fileName = $scope.MyContactObject.gender == "F" ? "/Female" : "/Male";

        
        if ($scope.MyContactObject.Hair != "") {

            UpdateHairTypeImages();
        }
        CheckScopeBeforeApply();

    });
    $scope.$watch('MyContactObject.Skin', function () {
        _genderFolder = $scope.MyContactObject.gender == "F" ? "/defaultFemale" : "/defaultMale";
        _fileName = $scope.MyContactObject.gender == "F" ? "/Female" : "/Male";
        if ($scope.MyContactObject.AgeType != "") {

            UpdateAgeTypeImages();
        }
        if ($scope.MyContactObject.Skin != "") {

            UpdateSkinTypeImages();
        }

        CheckScopeBeforeApply();

    });


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



        db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.MyContactObject.firstName, $scope.MyContactObject.lastName, $scope.MyContactObject.email, $scope.MyContactObject.gender, $scope.MyContactObject.places, $scope.MyContactObject.AgeType, $scope.MyContactObject.imagepath, $scope.MyContactObject.Relations], loadAndReset, onError); });

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


    $scope.IsAvailableEditObj = function (text) {
        var _defaultClass = "";
        
        for (var i = 0; i < $scope.ContactTipsFilter.length; i++) {
            if ($scope.ContactTipsFilter[i].Text == text) {
                _defaultClass = "green";
                return _defaultClass;
            }

        }
        return _defaultClass;
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
                return "My Generation";
                break;
            case 2:
            case "2":
                return "Much Younger than Me";

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
            case "My Color":
            case "1":
            case 1:
                return "mine";
                break;
            case "Darker":
            case "2":
            case 2:
                return "darkmine";
                break;
            case "Lighter":
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
                $scope.ContactsFilteredCopy = angular.copy($scope.Contacts);
                CheckScopeBeforeApply();


            });

        });
    }



    $scope.OpenEditModal = function (_obj) {
        localStorageService.set("EditContactSearchObj", _obj);
        $location.path("/addtips");
        $("#modal3").modal("hide");

    }

    $scope.FilterByTips = function (_TipsArray, _Contacts) {

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
                return "My Color";
                break;
            case 2:
                return "Darker";
                break;
            case 3:
                return "Lighter";
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
                return "My Height";
                break;
            case 2:
                return "Taller";
                break;
            case 3:
                return "Shorter";
                break;

            default:
                return "";
        }

    }
    $scope.AddtoTips = function (text) {

        if ($.trim($scope.MyContactObject.Tips) != "") {

            SearchText(text, function (matched) {
                if (!matched) {
                    $scope.MyContactObject.Tips = $scope.MyContactObject.Tips + "," + text;
                    $scope.ContactTips.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
                } else {
                    var y = angular.copy($scope.ContactTips);
                    y = jQuery.grep(y, function (value) {
                        return value.Text != text;
                    });

                    $scope.ContactTips = angular.copy(y);
                    $scope.MyContactObject.Tips = $.map($scope.ContactTips, function (obj) {
                        return obj.Text
                    }).join(",");
                }
            });

        }
        else {
            $scope.MyContactObject.Tips = text;
            $scope.ContactTips.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
        }
        $scope.Contacts = $scope.FilterByType($scope.ContactsCopy);
        CheckScopeBeforeApply();
    }
    function SearchText(name, callback) {
        var data = $scope.MyContactObject.Tips.split(",");
        var contains = (data.indexOf(name) > -1);
        callback(contains);

        return;


    }
    function SearchTextNew(name, callback) {
        var data = $scope.SelectedMyContactObject.Tips.split(",");
        var contains = (data.indexOf(name) > -1);
        callback(contains);

        return;
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
    $scope.HighLightTerm = function (term, Text) {
        if ($.trim(term) != "") {

            var src_str = Text;
            var term = term;
            term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
            var pattern = new RegExp("(" + term + ")", "gi");

            src_str = src_str.replace(pattern, "<mark>$1</mark>");
            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

            return src_str;
        }
        else {
            return Text;
        }
    }
    $scope.ResetFilter = function () {
        $scope.MyContactObject = { id: 0, firstName: "", lastName: "", email: "", gender: "", places: "", AgeType: "", imagepath: "", Relations: "", Tips: "", Hair: "", Skin: "", Height: "" };
        $scope.ContactTips = [];
        localStorageService.set("ContactSearchObj", "");
        $scope.Contacts = $scope.FilterByType($scope.ContactsCopy);
        $(".optionlist").hide();
        CheckScopeBeforeApply();
    }

    $scope.GetGenderClass = function (_G) {
        var _Class = "";
        _Class = _G == "" ? "" : (_G == "N" ? "purple" : (_G == "M" ? "blue" : "pink"));
        return _Class;
    }

    $scope.ClearSearchText = function () {
        $scope.NewTips.Text = "";
        CheckScopeBeforeApply();
    }

    $scope.ClearNameText = function () {
        $scope.NameText = "";
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

        if (GetTrimmedString($scope.MyContactObject.gender)) {

            _array = jQuery.grep(_array, function (el) {
                return el.gender == $scope.MyContactObject.gender;
            });
        }

        if (GetTrimmedString($scope.MyContactObject.Skin)) {
            _array = jQuery.grep(_array, function (el) {
                return el.Skin == GetSkin($scope.MyContactObject.Skin);
            });
        }

        if (GetTrimmedString($scope.MyContactObject.Tips)) {
            _array = jQuery.grep(_array, function (el) {
                return findMatch($scope.MyContactObject.Tips.split(","), [], el.Tips);
            });
        }
        if (GetTrimmedString($scope.MyContactObject.AgeType)) {
            _array = jQuery.grep(_array, function (el) {
                return el.AgeType == $scope.MyContactObject.AgeType;
            });
        }
        if (GetTrimmedString($scope.MyContactObject.Hair)) {
            _array = jQuery.grep(_array, function (el) {
                return el.Hair == GetHairs($scope.MyContactObject.Hair);
            });
        }
        if (GetTrimmedString($scope.MyContactObject.Height)) {

            _array = jQuery.grep(_array, function (el) {
                return el.Height == GetHeight($scope.MyContactObject.Height);
            });
        }




        return _array;
    }

    $scope.AddtoExistingTips = function (text) {

        
        if ($.trim($scope.SelectedMyContactObject.Tips) != "") {

            SearchTextNew(text, function (matched) {

                if (!matched) {
                    $scope.SelectedMyContactObject.Tips = $scope.SelectedMyContactObject.Tips + "," + text;
                    $scope.ContactTipsFilter.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
                } else {
                    var y = angular.copy($scope.ContactTipsFilter);
                    y = jQuery.grep(y, function (value) {
                        return value.Text != text;
                    });

                    $scope.ContactTipsFilter = angular.copy(y);
                    $scope.SelectedMyContactObject.Tips = $.map($scope.ContactTipsFilter, function (obj) {
                        return obj.Text
                    }).join(",");
                }
            });

        }
        else {
            $scope.SelectedMyContactObject.Tips = text;
            $scope.ContactTipsFilter.push({ id: 1 + Math.floor(Math.random() * 100), Text: text });
        }

        CheckScopeBeforeApply();
    }




    $scope.showgenderType = function () {

        $scope.showgender = true;
        CheckScopeBeforeApply();
    }


    $scope.isgender = "Male";


    $scope.selectedgender = function (gender) {

        localStorageService.set("Gender", gender);

        $scope.isgender = gender;

        $scope.showgender = false;

        CheckScopeBeforeApply();

    }



    function ShowTipsuccess() {
        $scope.Contacts = [];
        $scope.ContactsCopy = [];
        $scope.TipsCopy = [];

        showRecords();
        $scope.ToggleEdit();
        showRecordTips();
        log.success("Tips Updated Successfully");
    }

    $scope.UpdateTips = function () {
        var updateStatement = "UPDATE Contacts SET Tips=? WHERE id=?";
        db.transaction(function (tx) { tx.executeSql(updateStatement, [$scope.SelectedMyContactObject.Tips, $scope.SelectedMyContactObject.id], ShowTipsuccess, onError); });
    }
    $scope.showdetails = function (_obj) {

        $scope.IsEditMode = false;
        $scope.SelectedMyContactObject = _obj;

        $scope.ContactTipsFilter = [];
        if (_obj.Tips != null && _obj.Tips != undefined && $.trim(_obj.Tips) != "") {

            var _Data = _obj.Tips.split(",");
            for (var i = 0; i < _Data.length; i++) {

                $scope.ContactTipsFilter.push({ id: 1 + Math.floor(Math.random() * 100), Text: _Data[i] });
            }
        }
        $("#modal3").modal('show');
        CheckScopeBeforeApply();

    }
    $scope.CheckFilterArray = function () {
        if ($scope.MyContactObject.gender != '' || $scope.MyContactObject.AgeType != '' || $scope.MyContactObject.Skin != '' || $scope.MyContactObject.Hair != '' || $scope.MyContactObject.Height != '') {
            return true;
        }
        return false;
    }

    $scope.GetSelectedClass = function (_G, Type) {

        console.log($scope.Mysetting);

       
    

        var _class = "";

        switch (Type) {
            case 1:
                _class = $scope.MyContactObject.gender == _G ? "green" : "";
                break;
            case 2:
                _class = $scope.MyContactObject.AgeType == _G ? "green" : "";
                break;
            case 3:
                _class = $scope.MyContactObject.Hair == _G ? "green" : "";
                break;
            case 4:
                _class = $scope.MyContactObject.Skin == _G ? "green" : "";
                break;
            case 5:
                _class = $scope.MyContactObject.Height == _G ? "green" : "";
                break;
            default:
                _class = "";

        }

        return _class
    }


    function init() {

      

        initDatabase();


        var _contact = localStorageService.get("ContactSearchObj");

        if (_contact != null && _contact != undefined) {

            $scope.MyContactObject = _contact;

        }

        $scope.Mysetting = localStorageService.get("MydetailObj");

        console.log($scope.Mysetting);

        $scope.MyContactObject = $scope.Mysetting;


     //   $scope.GetSelectedClass($scope.Mysetting.gender,1)


        CheckScopeBeforeApply();

    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.UpdateGender = function (Type) {

        $(".blue").removeClass("green");
        $(".pink").removeClass("green");

      
        switch (Type) {
            case 1:
                $(".blue").addClass("green");
                $scope.isgender = "Male";
                break;
            case 2:
                $(".pink").addClass("green");
                $scope.isgender = "Female";
                break;
            default:
             
        }
        CheckScopeBeforeApply();
    }


    $scope.moveback = function () {
        $scope.showgender = false;
        CheckScopeBeforeApply();
    }

 
  

    $scope.GetMatches = function () {
        localStorageService.set("ContactSearchObj", $scope.MyContactObject);
        $location.path("/SearchData")
    }


    $scope.Mydetails = function ()
    {
        debugger;
        
        localStorageService.set("MydetailObj", $scope.MyContactObject);

        console.log($scope.MyContactObject);

        $scope.showgender = false;

        $scope.$apply();
    }





    init();






}]);