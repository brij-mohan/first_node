practinaPanel
  // =========================================================================
  // Base controller for common functions
  // =========================================================================
  .controller('practinaPanel', function($timeout, $state, $scope, $http, $rootScope, api, toastr, toastrConfig, ngDialog, cfpLoadingBar) {
    var headers = {
      'authorization': 'bearer ' + localStorage.getItem('accessToken')
    };

    if(localStorage.getItem('accessToken')){
        $rootScope.userType = localStorage.getItem('userType');
        $rootScope.dashUsername = localStorage.getItem('dashUsername');
        $rootScope.profilePicThumb = localStorage.getItem('UserThumb');
    }

    //User Permissions for post edit
    $rootScope.currentUserId = localStorage.getItem('userId');
    //If bad token then Redirects to login
    $rootScope.removeToken = function(){
      localStorage.removeItem('accessToken');
      $state.go('admin.login');
      $rootScope.openToast('error', 'Token is expired', '');
      return false;
    }
    //Post type dropdown
    $rootScope.posttype = [{
        "id": 1,
        "post_type": 'PROFESSIONAL'
      },
      {
        "id": 2,
        "post_type": 'HUMOR'
      },
      {
        "id": 3,
        "post_type": 'MIXED'
      },
    ];


    //Radio value for content type of post
    $rootScope.posttyperadioval = '';
    if($rootScope.posttyperadioval == 'TEXT'){
          $('#postContent').prop('required', true);
      }if($rootScope.posttyperadioval == 'IMAGE'){
            $('#postContent').prop('required', false);
        }if($rootScope.posttyperadioval == 'TEXTANDIMAGE'){
              $('#postContent').prop('required', true);
          }
    $rootScope.radioposttype = function(val) {
      $rootScope.posttyperadioval = val;
      //Check value of post
      if ($rootScope.posttyperadioval == 'TEXTANDIMAGE') {
          $rootScope.removeImageField = true;
          $('#postContent').prop('required', true);
      }
      if ($rootScope.posttyperadioval == 'IMAGE') {
          $rootScope.removeImageField = true;
          $('#postContent').prop('required', false);
      }
      if ($rootScope.posttyperadioval == 'TEXT') {
          $rootScope.removeImageField = false;
          $('#postContent').prop('required', true);
      }
    }


    $rootScope.headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    $rootScope.loginRedirect = function() {
      $state.go('user.login');
    }
    $rootScope.emailPattern = /^[a-z]+[a-z0-9.+_]+@[a-z]+\.[a-z.]{2,5}$/;
    $rootScope.namePattern = /^[a-zA-Z 0-9]*$/;

    $rootScope.hitInProgress = false;
    $rootScope.deviceId = function() {
      new Fingerprint2().get(function(result, components) {
        hash = result;
        localStorage.setItem('user', hash);
      });
    }
    $rootScope.deviceId();

    $rootScope.flagPopUps = function(flag, error) {
      cfpLoadingBar.complete();
      $rootScope.hitInProgress = false;
      if (flag == 4) {
        $rootScope.openToast('error', 'Session Expired', '');
        localStorage.removeItem('accessToken');
        $state.go('user.login');
        return false;
      }
      if (!$rootScope.messageList || $rootScope.messageList.length == 0) {} else {
        for (var i = 0; i < $rootScope.messageList.length; i++) {
          if (flag == $rootScope.messageList[i].flag && $rootScope.messageList[i].show_popup == 1) {
            if (error == 1)
              $rootScope.openToast('error', $rootScope.messageList[i].text, '');
            else
              $rootScope.openToast('success', $rootScope.messageList[i].text, '');
            $rootScope.hitInProgress = false;
          }
        }
      }
    }
    $rootScope.EmailAvailable = false;
    $rootScope.check_email = function(id, email) {
      // if (email) {
      //   $.post(api.url + 'check_doctor_email', {
      //       doctor_email: email,
      //       doctor_id: id
      //     })
      //     .success(function(data, status) {
      //       if (typeof data === 'string')
      //         var data = JSON.parse(data);
      //       $rootScope.flagPopUps(data.flag, data.is_error);
      //       if (data.is_error == 0) {
      //         $rootScope.EmailAvailable = false;
      //       } else {
      //         $rootScope.EmailAvailable = true;
      //       }
      //     });
      // }

    }

    var defaultConfig = angular.copy(toastrConfig);
    $rootScope.types = ['success', 'error', 'info', 'warning', 'primary'];
    var openedToasts = [];
    $rootScope.options = {
      autoDismiss: false,
      positionClass: 'toast-bottom-center',
      type: 'info',
      timeOut: '3000',
      extendedTimeOut: '2000',
      allowHtml: false,
      closeButton: false,
      tapToDismiss: true,
      progressBar: false,
      newestOnTop: true,
      maxOpened: 0,
      preventDuplicates: false,
      preventOpenDuplicates: false,
      title: "Title",
      msg: "Message"
    };

    $rootScope.clearLastToast = function() {
      var toast = openedToasts.pop();
      toastr.clear(toast);
    };

    $rootScope.clearToasts = function() {
      toastr.clear();
    };
    $rootScope.openToast = function(type, msg, title) {

      angular.extend(toastrConfig, $rootScope.options);
      openedToasts.push(toastr[type](msg, title));
      var strOptions = {};
      for (var o in $rootScope.options)
        if (o != 'msg' && o != 'title') strOptions[o] = $rootScope.options[o];
      $rootScope.optionsStr = "toastr." + type + "(\'" + msg + "\', \'" + title + "\', " + JSON.stringify(strOptions, null, 2) + ")";
    };
    $rootScope.$on('$destroy', function iVeBeenDismissed() {
      angular.extend(toastrConfig, defaultConfig);
    });


    if (localStorage.getItem('role')) {
      $rootScope.userRole = localStorage.getItem('role');
    }
    if ($rootScope.userType == 'USER') {
      $http.get('data/usersidebar-menu.json')
        .success(function(items) {
          $rootScope.sidebarItems = items;
        })
        .error(function(data, status, headers, config) {
          alert('Failure loading menu');
        });
    } else if($rootScope.userType == 'ADMIN') {
      $http.get('data/sidebar-menu.json')
        .success(function(items) {
          $rootScope.sidebarItems = items;
        })
        .error(function(data, status, headers, config) {
          alert('Failure loading menu');
        });
    }
    $rootScope.changePasswordFn = function() {
      $rootScope.change = {};
      $scope.visible = true;
      ngDialog.openConfirm({
        template: 'change_password_modal',
        className: 'ngdialog-theme-default bigPop',
        scope: $scope
      }).then(function(value) {}, function(reason) {});
    }
    $rootScope.changePasswordApi = function() {
        $rootScope.hitInProgress = true;
      var headers = {
        'authorization': 'bearer ' + localStorage.getItem('accessToken')
      };
      cfpLoadingBar.start();
      $http.put(api.url + "/api/user/changePassword", {
        oldPassword: $rootScope.change.oldPassword,
        newPassword: $rootScope.change.newPassword,
      }, {
        headers: headers
      }).success(function(data, status) {
        ngDialog.close();
        $rootScope.hitInProgress = false;
        $rootScope.openToast('success', 'Password Changed Successfully', '');
      }).error(function(data, status) {
        $rootScope.hitInProgress = false;
        ngDialog.close();
        $rootScope.openToast('error', 'Password Does not Changed', '');
      });
    }
    $rootScope.checkPractinaToken = function() {
      if (!localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
        $state.go('user.login');
      }
    }

    //Check token if user login from another pc
    $rootScope.checkToken = function(data) {
      if (data.statusCode == 401) {
            localStorage.removeItem('accessToken');
            $state.go('user.login');
      }
    }

    $scope.openConfirm = function() {
      $scope.visible = true;
      ngDialog.openConfirm({
        template: 'logout_modal',
        className: 'ngdialog-theme-default smallPop',
        scope: $scope
      }).then(function(value) {}, function(reason) {});

      $('#ngdialog1').find('div.ngdialog-content').attr('ng-show', 'visible');
    };

    $scope.ngDialogPop = function(template, className) {
      $scope.visible = true;
      ngDialog.openConfirm({
        template: template,
        className: 'ngdialog-theme-default ' + className,
        scope: $scope
      }).then(function(value) {}, function(reason) {});

    }

    //User logout
    $scope.userLogout = function() {
      cfpLoadingBar.start();
      var headers = {
        'authorization': 'bearer ' + localStorage.getItem('accessToken')
      };
      $http.put(api.url + "/api/user/logout", {}, {
          headers: headers
        })
        .success(function(data, status) {
          $rootScope.hitInProgress = true;
          ngDialog.close();
          $rootScope.hitInProgress = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('dashUsername');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          localStorage.removeItem('UserThumb');
          $rootScope.openToast('success', 'Logged Out Successfully', '');
          $state.go('user.login');
          cfpLoadingBar.complete();
        });
    };
    // Timepicker
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = !$scope.ismeridian;
    };

    // Detact Mobile Browser
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      angular.element('html').addClass('ismobile');
    }

    // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
    this.sidebarToggle = {
      left: false,
      right: false
    }

    // By default template has a boxed layout
    this.layoutType = '1';
    //localStorage.getItem('ma-layout-status');


    // For Mainmenu Active Class
    this.$state = $state;

    //Close sidebar on click
    this.sidebarStat = function(event) {
      if (!angular.element(event.target).parent().hasClass('active')) {
        this.sidebarToggle.left = false;
      }
    }

    //Listview Search (Check listview pages)
    this.listviewSearchStat = false;

    this.lvSearch = function() {
      this.listviewSearchStat = true;
    }

    //Listview menu toggle in small screens
    this.lvMenuStat = false;

    //Blog
    this.wallCommenting = [];

    this.wallImage = false;
    this.wallVideo = false;
    this.wallLink = false;

    //Skin Switch
    this.currentSkin = 'denefits';

    this.skinList = [
      'lightblue',
      'bluegray',
      'cyan',
      'teal',
      'green',
      'orange',
      'blue',
      'purple',
      'denefits'
    ]

    this.skinSwitch = function(color) {
      this.currentSkin = color;
    }

  })


  // =========================================================================
  // Header
  // =========================================================================
  .controller('headerCtrl', function($timeout, messageService, $scope) {

    // Top Search
    this.openSearch = function() {
      angular.element('#header').addClass('search-toggled');
      angular.element('#top-search-wrap').find('input').focus();
    }

    this.closeSearch = function() {
      angular.element('#header').removeClass('search-toggled');
    }

    // Get messages and notification for header
    this.img = messageService.img;
    this.user = messageService.user;
    this.user = messageService.text;

    this.messageResult = messageService.getMessage(this.img, this.user, this.text);


    //Clear Notification
    this.clearNotification = function($event) {
      $event.preventDefault();

      var x = angular.element($event.target).closest('.listview');
      var y = x.find('.lv-item');
      var z = y.size();

      angular.element($event.target).parent().fadeOut();

      x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
      x.find('.grid-loading').fadeIn(1500);
      var w = 0;

      y.each(function() {
        var z = $(this);
        $timeout(function() {
          z.addClass('animated fadeOutRightBig').delay(1000).queue(function() {
            z.remove();
          });
        }, w += 150);
      })

      $timeout(function() {
        angular.element('#notifications').addClass('empty');
      }, (z * 150) + 200);
    }

    // Clear Local Storage
    this.clearLocalStorage = function() {

      //Get confirmation, if confirmed clear the localStorage
      swal({
        title: "Are you sure?",
        text: "All your saved localStorage values will be removed",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F44336",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      }, function() {
        localStorage.clear();
        swal("Done!", "localStorage is cleared", "success");
      });

    }

    //Fullscreen View
    this.fullScreen = function() {
      //Launch
      function launchIntoFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      //Exit
      function exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }

      if (exitFullscreen()) {
        launchIntoFullscreen(document.documentElement);
      } else {
        launchIntoFullscreen(document.documentElement);
      }
    }

  })



  // =========================================================================
  // Best Selling Widget
  // =========================================================================

  .controller('bestsellingCtrl', function(bestsellingService) {
    // Get Best Selling widget Data
    this.img = bestsellingService.img;
    this.name = bestsellingService.name;
    this.range = bestsellingService.range;

    this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
  })


  // =========================================================================
  // Todo List Widget
  // =========================================================================

  .controller('todoCtrl', function(todoService) {

    //Get Todo List Widget Data
    this.todo = todoService.todo;

    this.tdResult = todoService.getTodo(this.todo);

    //Add new Item (closed by default)
    this.addTodoStat = false;
  })


  // =========================================================================
  // Recent Items Widget
  // =========================================================================

  .controller('recentitemCtrl', function(recentitemService) {

    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;

    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
  })


  // =========================================================================
  // Recent Posts Widget
  // =========================================================================

  .controller('recentpostCtrl', function(recentpostService) {

    //Get Recent Posts Widget Items
    this.img = recentpostService.img;
    this.user = recentpostService.user;
    this.text = recentpostService.text;

    this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
  })


  //=================================================
  // Profile
  //=================================================

  .controller('profileCtrl', function() {

    //Get Profile Information from profileService Service

    //User
    this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

    this.fullName = "Mallinda Hollaway";
    this.gender = "female";
    this.birthDay = "23/06/1988";
    this.martialStatus = "Single";
    this.mobileNumber = "00971123456789";
    this.emailAddress = "malinda.h@gmail.com";
    this.twitter = "@malinda";
    this.twitterUrl = "twitter.com/malinda";
    this.skype = "malinda.hollaway";
    this.addressSuite = "44-46 Morningside Road";
    this.addressCity = "Edinburgh";
    this.addressCountry = "Scotland";

    //Edit
    this.editSummary = 0;
    this.editInfo = 0;
    this.editContact = 0;


    this.submit = function(item, message) {
      if (item === 'profileSummary') {
        this.editSummary = 0;
      }

      if (item === 'profileInfo') {
        this.editInfo = 0;
      }

      if (item === 'profileContact') {
        this.editContact = 0;
      }


    }

  })



  //=================================================
  // CALENDAR
  //=================================================

  .controller('calendarCtrl', function($modal) {

    //Create and add Action button with dropdown in Calendar header.
    this.month = 'month';

    this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
      '<li class="dropdown" dropdown>' +
      '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
      '<ul class="dropdown-menu dropdown-menu-right">' +
      '<li class="active">' +
      '<a data-calendar-view="month" href="">Month View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="basicWeek" href="">Week View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="basicDay" href="">Day View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
      '</li>' +
      '</ul>' +
      '</div>' +
      '</li>';


    //Open new event modal on selecting a day
    this.onSelect = function(argStart, argEnd) {
      var modalInstance = $modal.open({
        templateUrl: 'addEvent.html',
        controller: 'addeventCtrl',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          calendarData: function() {
            var x = [argStart, argEnd];
            return x;
          }
        }
      });
    }
  })

  //Add event Controller (Modal Instance)
  .controller('addeventCtrl', function($scope, $modalInstance, calendarData) {

    //Calendar Event Data
    $scope.calendarData = {
      eventStartDate: calendarData[0],
      eventEndDate: calendarData[1]
    };

    //Tags
    $scope.tags = [
      'bgm-teal',
      'bgm-red',
      'bgm-pink',
      'bgm-blue',
      'bgm-lime',
      'bgm-green',
      'bgm-cyan',
      'bgm-orange',
      'bgm-purple',
      'bgm-gray',
      'bgm-black',
    ]

    //Select Tag
    $scope.currentTag = '';

    $scope.onTagClick = function(tag, $index) {
      $scope.activeState = $index;
      $scope.activeTagColor = tag;
    }

    //Add new event
    $scope.addEvent = function() {
      if ($scope.calendarData.eventName) {

        //Render Event
        $('#calendar').fullCalendar('renderEvent', {
          title: $scope.calendarData.eventName,
          start: $scope.calendarData.eventStartDate,
          end: $scope.calendarData.eventEndDate,
          allDay: true,
          className: $scope.activeTagColor

        }, true); //Stick the event

        $scope.activeState = -1;
        $scope.calendarData.eventName = '';
        $modalInstance.close();
      }
    }

    //Dismiss
    $scope.eventDismiss = function() {
      $modalInstance.dismiss();
    }
  })

  // =========================================================================
  // COMMON FORMS
  // =========================================================================

  .controller('formCtrl', function() {

    //Input Slider
    this.nouisliderValue = 4;
    this.nouisliderFrom = 25;
    this.nouisliderTo = 80;
    this.nouisliderRed = 35;
    this.nouisliderBlue = 90;
    this.nouisliderCyan = 20;
    this.nouisliderAmber = 60;
    this.nouisliderGreen = 75;

    //Color Picker
    this.color = '#03A9F4';
    this.color2 = '#8BC34A';
    this.color3 = '#F44336';
    this.color4 = '#FFC107';
  })


  // =========================================================================
  // PHOTO GALLERY
  // =========================================================================

  .controller('photoCtrl', function() {

    //Default grid size (2)
    this.photoColumn = 'col-md-2';
    this.photoColumnSize = 2;

    this.photoOptions = [{
        value: 2,
        column: 6
      },
      {
        value: 3,
        column: 4
      },
      {
        value: 4,
        column: 3
      },
      {
        value: 1,
        column: 12
      },
    ]

    //Change grid
    this.photoGrid = function(size) {
      this.photoColumn = 'col-md-' + size;
      this.photoColumnSize = size;
    }

  })


  // =========================================================================
  // ANIMATIONS DEMO
  // =========================================================================
  .controller('animCtrl', function($timeout) {

    //Animation List
    this.attentionSeekers = [{
        animation: 'bounce',
        target: 'attentionSeeker'
      },
      {
        animation: 'flash',
        target: 'attentionSeeker'
      },
      {
        animation: 'pulse',
        target: 'attentionSeeker'
      },
      {
        animation: 'rubberBand',
        target: 'attentionSeeker'
      },
      {
        animation: 'shake',
        target: 'attentionSeeker'
      },
      {
        animation: 'swing',
        target: 'attentionSeeker'
      },
      {
        animation: 'tada',
        target: 'attentionSeeker'
      },
      {
        animation: 'wobble',
        target: 'attentionSeeker'
      }
    ]
    this.flippers = [{
        animation: 'flip',
        target: 'flippers'
      },
      {
        animation: 'flipInX',
        target: 'flippers'
      },
      {
        animation: 'flipInY',
        target: 'flippers'
      },
      {
        animation: 'flipOutX',
        target: 'flippers'
      },
      {
        animation: 'flipOutY',
        target: 'flippers'
      }
    ]
    this.lightSpeed = [{
        animation: 'lightSpeedIn',
        target: 'lightSpeed'
      },
      {
        animation: 'lightSpeedOut',
        target: 'lightSpeed'
      }
    ]
    this.special = [{
        animation: 'hinge',
        target: 'special'
      },
      {
        animation: 'rollIn',
        target: 'special'
      },
      {
        animation: 'rollOut',
        target: 'special'
      }
    ]
    this.bouncingEntrance = [{
        animation: 'bounceIn',
        target: 'bouncingEntrance'
      },
      {
        animation: 'bounceInDown',
        target: 'bouncingEntrance'
      },
      {
        animation: 'bounceInLeft',
        target: 'bouncingEntrance'
      },
      {
        animation: 'bounceInRight',
        target: 'bouncingEntrance'
      },
      {
        animation: 'bounceInUp',
        target: 'bouncingEntrance'
      }
    ]
    this.bouncingExits = [{
        animation: 'bounceOut',
        target: 'bouncingExits'
      },
      {
        animation: 'bounceOutDown',
        target: 'bouncingExits'
      },
      {
        animation: 'bounceOutLeft',
        target: 'bouncingExits'
      },
      {
        animation: 'bounceOutRight',
        target: 'bouncingExits'
      },
      {
        animation: 'bounceOutUp',
        target: 'bouncingExits'
      }
    ]
    this.rotatingEntrances = [{
        animation: 'rotateIn',
        target: 'rotatingEntrances'
      },
      {
        animation: 'rotateInDownLeft',
        target: 'rotatingEntrances'
      },
      {
        animation: 'rotateInDownRight',
        target: 'rotatingEntrances'
      },
      {
        animation: 'rotateInUpLeft',
        target: 'rotatingEntrances'
      },
      {
        animation: 'rotateInUpRight',
        target: 'rotatingEntrances'
      }
    ]
    this.rotatingExits = [{
        animation: 'rotateOut',
        target: 'rotatingExits'
      },
      {
        animation: 'rotateOutDownLeft',
        target: 'rotatingExits'
      },
      {
        animation: 'rotateOutDownRight',
        target: 'rotatingExits'
      },
      {
        animation: 'rotateOutUpLeft',
        target: 'rotatingExits'
      },
      {
        animation: 'rotateOutUpRight',
        target: 'rotatingExits'
      }
    ]
    this.fadeingEntrances = [{
        animation: 'fadeIn',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInDown',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInDownBig',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInLeft',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInLeftBig',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInRight',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInRightBig',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInUp',
        target: 'fadeingEntrances'
      },
      {
        animation: 'fadeInBig',
        target: 'fadeingEntrances'
      }
    ]
    this.fadeingExits = [{
        animation: 'fadeOut',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutDown',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutDownBig',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutLeft',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutLeftBig',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutRight',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutRightBig',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutUp',
        target: 'fadeingExits'
      },
      {
        animation: 'fadeOutUpBig',
        target: 'fadeingExits'
      }
    ]
    this.zoomEntrances = [{
        animation: 'zoomIn',
        target: 'zoomEntrances'
      },
      {
        animation: 'zoomInDown',
        target: 'zoomEntrances'
      },
      {
        animation: 'zoomInLeft',
        target: 'zoomEntrances'
      },
      {
        animation: 'zoomInRight',
        target: 'zoomEntrances'
      },
      {
        animation: 'zoomInUp',
        target: 'zoomEntrances'
      }
    ]
    this.zoomExits = [{
        animation: 'zoomOut',
        target: 'zoomExits'
      },
      {
        animation: 'zoomOutDown',
        target: 'zoomExits'
      },
      {
        animation: 'zoomOutLeft',
        target: 'zoomExits'
      },
      {
        animation: 'zoomOutRight',
        target: 'zoomExits'
      },
      {
        animation: 'zoomOutUp',
        target: 'zoomExits'
      }
    ]

    //Animate
    this.ca = '';

    this.setAnimation = function(animation, target) {
      if (animation === "hinge") {
        animationDuration = 2100;
      } else {
        animationDuration = 1200;
      }

      angular.element('#' + target).addClass(animation);

      $timeout(function() {
        angular.element('#' + target).removeClass(animation);
      }, animationDuration);
    }

  })
