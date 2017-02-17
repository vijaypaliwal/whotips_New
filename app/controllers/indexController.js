'use strict';
app.controller('indexController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', '$cordovaStatusbar', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard, $cordovaStatusbar) {
    

    var bodyheight = $(window).height();


    function bufferToBase64(buf) {
        var binstr = Array.prototype.map.call(buf, function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        return btoa(binstr);
    }
    $scope.GetImageFromurl=function(Url)
    {
       // Url = Url.replace("assets-library://", "cdvfile://localhost/assets-library/");
        window.resolveLocalFileSystemURL(Url, function (fileEntry) {

          

            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (event) {
                    alert(typeof event.target.result);
                    var obj = event.target.result;

                    $.each(obj, function (key, element) {
                        alert('key: ' + key + '\n' + 'value: ' + element);
                    });
                    var data = new Uint8Array(event.target.result);
                    var _Data = "data:image/jpeg;base64," + bufferToBase64(event.target.result);
                    alert("complete file read" + _Data);
                    return _Data;
                };
                alert('Reading file: ' + file.name);
                reader.readAsArrayBuffer(file);
            });
        });
    }
    $scope.curentclass = "";

    if (bodyheight > 665 && bodyheight < 675) {

        $(".findoptionicon").addClass("iphone6");

        $(".tile").addClass("iphone6");
        $scope.curentclass = "iphone6"
    }

    if (bodyheight > 730) {

        $(".findoptionicon").addClass("iphone6plus");

        $(".tile").addClass("iphone6plus");
        $scope.curentclass = "iphone6plus";
    }

   

    var tableheight = bodyheight - 365;

    $scope.tableheight = tableheight.toString() + "px";


  



    $scope.CurrentPage = "Add";
    $scope.ActivePath = "menu";
    
    $scope.$on('$locationChangeStart', function (event) {



        var _path = $location.path();


      
        switch (_path) {
            case "/status":
                $scope.CurrentPage = "Add";
                $scope.ActivePath = "menu";
                break;
            case "/find":
                $scope.CurrentPage = "Find";
                $scope.ActivePath = "menu";
                
                break;
            case "/tips":
                $scope.CurrentPage = "Tips";
                $scope.ActivePath = "more";
                break;
            case "/users":
                $scope.CurrentPage = "People";
                $scope.ActivePath = "more";

                break;
            case "/more":
                $scope.CurrentPage = "More";
                $scope.ActivePath = "menu";
                break;
            case "/SearchData":
                $scope.CurrentPage = "Filtered Contacts";
                $scope.ActivePath = "find";
                break;
            default:

                $scope.CurrentPage = "";
        }


        

        if (_path == "/status" || _path == "/addtips") {

            $cordovaKeyboard.disableScroll(true);
        }
        else if (_path == "/more")
        {
           // RemoveDb();
           // $cordovaKeyboard.disableScroll(false);
        }
        else {

            $cordovaKeyboard.disableScroll(false);
        }

        $cordovaKeyboard.hideAccessoryBar(false);


    });


    $(document)
  .on('focus', 'input,select', function () {

      // $cordovaKeyboard.disableScroll(true);



      //$('.bottomarea').css("position", "absolute");
      //$('.topheader').css('position', 'absolute');

  })
  .on('blur', 'input,select', function () {

      //$cordovaKeyboard.disableScroll(false);
      //$('.bottomarea').css("position", "fixed");
      //$('.topheader').css('position', 'fixed');

  });


     var _tmp= (bodyheight * 6) / 100 ;
     $scope.topheaderheight = _tmp.toString() + "px";

     var resultarea = (bodyheight * 28) / 100;

     $scope.resultarea = resultarea.toString() + "px";

     $scope.topdummyarea = (resultarea + 45).toString() + "px";

     $scope.topselectionarea = (resultarea + 45 + 53).toString() + "px";

     var headinglineheight = (resultarea * 11) / 100;

     $scope.headinglineheight = headinglineheight.toString() + "px";

     var selectionarea = (bodyheight * 28) / 100;

     $scope.selectionarea = selectionarea.toString() + "px";

     var dataarea = (bodyheight * 30) / 100;

     $scope.dataarea = dataarea.toString() + "px";

     var bottomarea = (bodyheight * 6) / 100;

     $scope.bottomarea = bottomarea.toString() + "px";


     var tiparea = (bodyheight - 485);

     $scope.tiparea = tiparea.toString() + "px";
    
     var possibleheight = bodyheight - (210 + tiparea);
     $scope.possibleheight = possibleheight.toString() + "px";


    $scope.logOut = function () {
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");

        authService.logOut();
        $("#modalerror").modal('hide');
        $("#Inventoryerror").modal('hide');
        $location.path('/login');
    }


    
    $scope.GetTrimmedString = function (id) {
        var _string = $(id).val();
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string == "" ? true : false;
    }

    $scope.GetTrimmedStringData = function (_string) {
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string;
    }
    $scope.RemoveDb=function () {
        var _db = openDatabase("ContactsBook", "1.0", "Contacts Book", 200000);
        var deleteStatement1 = "DELETE FROM Contacts;";
        var _dstatement = "DELETE FROM Tips;";
        var _confirm = confirm("Are you sure to reset database ?")
        if (_confirm) {
            _db.transaction(function (tx) { tx.executeSql(deleteStatement1, [], null, null); });
            _db.transaction(function (tx) { tx.executeSql(_dstatement, [], null, null); });
            localStorageService.set("RecentlyAddedTips",[])
        }
    }
    $scope.ShowErrorMessage = function (Place, TextType, Type, Message) {
        var _returnError = ""
        if (Message != undefined && Message != null) {

        }
        else {
            Message = "";
        }
        switch (TextType) {
            case 1:
                _returnError = "Error occurred in fetching " + Place + " " + Message;
                break;
            case 2:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
                break;
            case 3:
                _returnError = "Error occurred during updating data " + Place + " " + Message;
                break;
            default:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
        }

        switch (Type) {
            case 1:
                log.error(_returnError);
                break;
            case 2:
                log.warning(_returnError);
                break;
            default:

        }
    }


    $(document).ajaxError(function (event, jqxhr, settings, exception) {

        if (jqxhr.status != 200 && (jqxhr.readyState != 0 || jqxhr.status != 0)) {
            if (exception != "timeout") {

                $(".modal").modal("hide");
                HideGlobalWaitingDiv();
                $("#modalerror").modal('show');
                $("#errortext").html(exception);
            }
        }
    });


    $scope.reload = function () {

        window.location.reload();

    }

    $scope.errorbox = function (error) {

        $("#modalerror").modal('show');
        $("#errortext").html(error)

    }


    $scope.changepage = function () {
        setTimeout(
        function () {
            $scope.getactivepermission();
        }, 500
        )
    }


  

    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
    $scope.getActiveClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'none' : '';
    }

    $scope.authentication = authService.authentication;

  

    

  

}]);