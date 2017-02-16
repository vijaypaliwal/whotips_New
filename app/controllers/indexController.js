'use strict';
app.controller('indexController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', '$cordovaStatusbar', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard, $cordovaStatusbar) {
    function checkurl() {
        var path = "activity";
        if ($location.path().substr(0, path.length) !== path) {
            // UpdateStatusBar(55);
        }
        else {
            console.log("into activity");
        }
    }

    var bodyheight = $(window).height();



    $scope.GetImageFromurl=function(Url)
    {
        window.resolveLocalFileSystemURL(Url, function (fileEntry) {

          

            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (event) {
                    var _Data = "data:image/jpeg;base64," + Base64.encode(event.target.result);
                    alert("complete file read" + _Data);
                    return _Data;
                };
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

    $scope.GetProfileData = function () {


        authService.GetuserInfo();
        setTimeout(function () {
            $scope.UserInfoData = authService.UserInfo;
            if ($scope.UserInfoData != null && $scope.UserInfoData != undefined) {

                console.log($scope.UserInfoData);
                $scope.username = $scope.UserInfoData.username;
                $scope.myprofileimage = $scope.UserInfoData.myprofileimage;
                $scope.picURl = $scope.UserInfoData.picURl;
                $scope.$apply();
            }
        }, 1000)

    }
    function TryParseInt(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
    }
    $scope.Validation = function (value, type) {
        switch (type) {
            case 1:
                value = TryParseInt(value, -9890);
                if (value != -9890 && typeof (value) === "number") {
                    return true;
                }
                else { return false; }
                break;
            case 2:
                if (typeof (value) === "boolean") {
                    return true;
                }
                else { return true; }
                break;
            case 3:
                if (typeof (value) === "date") {
                    return true;
                }
                else { return true; }
                break;
            default:

        }
    }



    $scope.UploadImage = function (txnID, ImageList, pID) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        //  log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'UploadImage',
              contentType: 'application/json; charset=utf-8',
              dataType: 'text json',
              async: true,
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID, "pID": pID }),
              success: function (response) {
                  if (response.UploadImageResult.Success == true) {

                      log.success("Image has been uploaded success fully for last inventory record.");
                      var _path = $location.path();
                      if (_path == "/inventory") {
                          $scope.GetInventories();
                      }

                      CheckScopeBeforeApply();
                  }
                  else {

                      $scope.ShowErrorMessage("Upload image", 1, 1, response.UploadImageResult.Message)
                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          if (err.status == 200) {
                              log.success("Image has been uploaded success fully for last inventory record.");
                              var _path = $location.path();
                              if (_path == "/inventory") {
                                  $scope.GetInventories();
                              }

                          }
                          else {
                              log.error(err.statusText);

                          }
                      }
                  }
              }
          });

    }
    $scope.SaveImages = function (txnID, ImageList) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
         ({
             type: "POST",
             url: serviceBase + 'UploadImage',
             contentType: 'application/json; charset=utf-8',

             dataType: 'json',
             data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID }),
             success: function (response) {
                 if (response.UploadImageResult.Success == true) {

                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")

                 }
                 else {
                     log.error(response.UploadImageResult.Message);
                 }



             },
             error: function (err) {
                 alert(err.status);
                 if (err.status == 200 || err.status == "200") {
                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")
                 }
                 else {
                     console.log(err);
                     log.error("Error Occurred during operation");
                 }



             }
         });
    }

    if (_Islive) {
        checkurl();

    }


  

}]);