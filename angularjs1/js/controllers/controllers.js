practinaPanel

  //=================================================
  // User LOGIN
  //=================================================

  .controller('userloginCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {
    if (localStorage.getItem('accessToken')) {
      if ($state.current.name == "user.login") {
        $rootScope.checkPractinaToken();
      }
    }
    $rootScope.hitInProgress = false;
    ngDialog.close();
    $scope.userlogin = {
      email: '',
      password: ''
    };

    $scope.loginUser = function() {
      $rootScope.clearLastToast();
      $rootScope.clearToasts();
      $rootScope.hitInProgress = true;
      cfpLoadingBar.start();
      var data = {
        email: $scope.userlogin.practina_email,
        password: $scope.userlogin.practina_password
      };
      $http.post(api.url + "/api/user/login", data)
        .success(function(data, status) {
          console.log('User login data : ', data);
          if (typeof data === 'string')
            var data = JSON.parse(data);
          $timeout(function() {
            if (data.statusCode == 200) {
              $scope.userData = data.data.userDetails;
              cfpLoadingBar.complete();
              $rootScope.openToast('success', 'Logged In Successfully', '');
              localStorage.setItem('accessToken', data.data.accessToken);
              localStorage.setItem('dashUsername', $scope.userData.name);
              localStorage.setItem('userType', $scope.userData.userRole);
              localStorage.setItem('userId', $scope.userData._id);

              if ($scope.userData.profilePicURL.thumbnail != null) {
                localStorage.setItem('UserThumb', $scope.userData.profilePicURL.thumbnail);
              } else {
                localStorage.setItem('UserThumb', 'img/SVG/avatar.svg');
              }
              $state.go('app.dashboard');
              $scope.roleReload();
            }
          })
        })
        .error(function(data, status) {
          $rootScope.hitInProgress = false;
          $rootScope.openToast('error', data.message, '');
          cfpLoadingBar.complete();
        })

    };
    $scope.roleReload = function() {
      $rootScope.userType = localStorage.getItem('userType');
      $rootScope.dashUsername = localStorage.getItem('dashUsername');
      $rootScope.profilePicThumb = localStorage.getItem('UserThumb');
      $rootScope.currentUserId = localStorage.getItem('userId');
      if($rootScope.userType =='USER'){
          $http.get('data/usersidebar-menu.json')
            .success(function(items) {
              $rootScope.sidebarItems = items;
            })
            .error(function(data, status, headers, config) {
              alert('Failure loading menu');
            });
      }else{
            $http.get('data/sidebar-menu.json')
              .success(function(items) {
                $rootScope.sidebarItems = items;
              })
              .error(function(data, status, headers, config) {
                alert('Failure loading menu');
              });
      }
    }

  })


  //==============================
  //  Forgot Password
  //==============================

  .controller('forgotPasswordCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {

    ngDialog.close();
    $scope.forgot = {
      practina_email: ''
    };

    $scope.forgotEmailFn = function() {
      $rootScope.hitInProgress = true;
      cfpLoadingBar.start();
      $http.put(api.url + "/api/user/forgotPassword", {
            email: $scope.forgot.practina_email
        })
        .success(function(data, status) {
            if (typeof data === 'string')
            var data = JSON.parse(data);
            console.log('forgot data: ', data);
            $rootScope.openToast('success', 'An Email is send your email id', '');
            $state.go('user.login');
        }).error(function(data, status) {

        });

    };
  })


//==============================
//  Reset Password
//==============================

.controller('resetPasswordCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar, $location) {

  ngDialog.close();
  $scope.reset = {
    practina_email: '',
    new_password: ''
  };

 var passResetToken = $location.absUrl().split('=').pop();
  $scope.resetPassFn = function() { console.log('token : ',passResetToken);
    $rootScope.hitInProgress = true;
    cfpLoadingBar.start();
    $http.put(api.url + "/api/user/resetPassword?passwordResetToken="+passResetToken, {
      email: $scope.reset.resetemail,
      newPassword: $scope.reset.newPassword
    })
      .success(function(data, status) {
          $rootScope.hitInProgress = false;
          if (typeof data === 'string')
          var data = JSON.parse(data);
          console.log('reset data: ', data);
          $rootScope.openToast('success', 'Password is reset Successfully', '');
          $state.go('user.login');
      }).error(function(data, status) {
            $rootScope.hitInProgress = false;
      });

  };
})

  //=================================================
  // Add Dashboard
  //=================================================

  .controller('dashboardCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {
    $rootScope.checkPractinaToken();
    ngDialog.close();
    $scope.image_posting = 169;
    $scope.text_posting = 190;
    $scope.total_posting = 444;

  })

  //=================================================
  // Add Postings
  //=================================================

  .controller('addPostingCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar, Upload) {
    $rootScope.checkPractinaToken();
    ngDialog.close();
    var headers = {
      'authorization': 'bearer ' + localStorage.getItem('accessToken')
    };
    $rootScope.hitInProgress = false;
    //Show custom error like in dropdown
    $scope.industrytypeerror = false;
    $scope.posttypeerror = false;
    $scope.industry_error = false;
    $scope.posttype_error = false;

    //Validation for Image upload
    $scope.imageUpload = false;
    $scope.imagetitleerror = false;

    $rootScope.removeImageField = true;

    //Get Content type value from radio button
    $rootScope.posttyperadioval = 'TEXTANDIMAGE';
    if($rootScope.posttyperadioval == 'TEXT'){
          $('#postContent').prop('required', true);
      }if($rootScope.posttyperadioval == 'IMAGE'){
              $('#postContent').prop('required', false);
          }if($rootScope.posttyperadioval == 'TEXTANDIMAGE'){
                $('#postContent').prop('required', true);
            }
    //Dropdown option variable or update industry type or category value
    $scope.industry_type_option = 'Choose Industry Type';
    $scope.industryId = '';
    $scope.industryValFn = function(industryname, id) {
      $scope.industrytypeerror = false;
      $scope.industry_error = true;
      $scope.industry_type_option = industryname;
      $scope.industryId = id;
      var industry_id = id;
      $scope.postEditFn();
      if ($scope.industry_error && $scope.posttype_error) {
        $scope.postEditFn();
      }
    };

    //Get user industry dropdown values
      $http.get(api.url + "/api/user/getIndustries", {
        headers: headers
      }).success(function(data, status) {
        cfpLoadingBar.complete();
        $timeout(function() {
          $scope.industrytype1 = data.data;
        });
      }).error(function(data, status) {
        cfpLoadingBar.complete();
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('error', 'Error In Industry', '');
      }
      });

    //Update post type value in dropdown
    $scope.post_type_option = 'Choose Post Type';
    $scope.post_type_id ='';
    $scope.postTypeValFn = function(post_type, id) {
      $scope.posttypeerror = false;
      $scope.posttype_error = true;
      $scope.post_type_option = post_type;
      $scope.post_type_id = id;
      $scope.postEditFn();
      if ($scope.industry_error && $scope.posttype_error) {
        $scope.postEditFn();
      }
    };
    //enable add post button
    $scope.postEdit = false;
    $scope.postEditFn = function() {
      $timeout(function() {
        $scope.postEdit = true;
      });
    }
    $scope.postdata = {};
    $scope.postdata.content = 'TEXTANDIMAGE';
    //Upload Image data
    $scope.postFile = {};
    $scope.uploadFiles = function(File) {
      $scope.postFile = File[0];
      if (angular.isDefined($scope.postFile.name)) {
        $scope.postEditFn();
      }
    }

    //Upload addpost form data
    $scope.savePostData = function() { ;
      cfpLoadingBar.start();
      $rootScope.hitInProgress = true;
      if ($scope.industryId == '' || $scope.industryId == null) {
              $scope.industrytypeerror = true;
              $scope.postEdit = false;
              cfpLoadingBar.complete();
              $rootScope.hitInProgress = false;
      }
      if ($scope.post_type_id == '' || $scope.post_type_id == null) {
            $scope.posttypeerror = true;
            $scope.postEdit = false;
            cfpLoadingBar.complete();
           $rootScope.hitInProgress = false;
      }
      if ($scope.imageUpload && $scope.postdata.image_title == '') {
              $scope.imagetitleerror = true;
              $scope.postEdit = false;
              cfpLoadingBar.complete();
              $rootScope.hitInProgress = false;
      } else {
          $scope.imagetitleerror = false;
          $scope.postEditFn();
          cfpLoadingBar.complete();
      }
      var form = new FormData();
      form.append('title', $scope.postdata.title);
      form.append('content', $rootScope.posttyperadioval);
      form.append('postType', $scope.post_type_option);
      form.append('text', $scope.postdata.post_content);
      form.append('industryId', $scope.industryId);
      form.append('hashtags', $scope.postdata.hashtags);
      form.append('image', $scope.postFile);
      if($scope.post_type_id != '' && $scope.industryId != ''){
      $http.post(api.url + "/api/user/addPost", form, {
        transformRequest: angular.identity,
        headers: {
          'authorization': 'bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': undefined
        }
      }).success(function(data, status) {
        $timeout(function() {
          cfpLoadingBar.complete();
          $rootScope.hitInProgress = false;
          $rootScope.openToast('success', 'Post Created Successfully', '');
          $state.go('app.managepost');
        });
      }).error(function(data, status) {
        $rootScope.hitInProgress = false;
        cfpLoadingBar.complete();
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('error', data.message, '');
      }
      });
    }

    };
  })

  //=================================================
  // Add Industry Type
  //=================================================

  .controller('addIndustryCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {
    $rootScope.checkPractinaToken();
    $rootScope.hitInProgress = false;
    ngDialog.close();
    //enable add post button
    $scope.postEdit = false;
    $scope.postEditFn = function() {
      $scope.postEdit = true;
    }

    //Upload addpost form data
    $scope.postdata = {};
    $scope.savePostData = function() {
      if ($rootScope.industryId == '' || $rootScope.industryId == null) {
        $scope.industrytypeerror = true;
        $scope.postEdit = false;
      }
    }

    $scope.industrydata = {};
    $scope.addIndustryType = function() {
      cfpLoadingBar.start();
      $rootScope.hitInProgress = true;
      var form = new FormData();
      if ($scope.industrydata.name.trim().length == 0) {
        $rootScope.openToast('warning', 'Enter a valid name', '');
        return false;
      }
      form.append('name', $scope.industrydata.name);
      form.append('businessType', $scope.industrydata.type);
      form.append('description', $scope.industrydata.desc);
      form.append('profilePic', "");
      $http.post(api.url + "/api/user/addIndustry", form, {
          transformRequest: angular.identity,
          headers: {
            'authorization': 'bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': undefined
          }
        }).success(function(data, status) {
          cfpLoadingBar.complete();
          $rootScope.hitInProgress = false;
          if (typeof data === 'string')
            var data = JSON.parse(data);
          $timeout(function() {
              $rootScope.openToast('success', 'Industry Added Successfully', '');
              $state.go('app.manageindustry');
          });
        })
        .error(function(data, status) {
          cfpLoadingBar.complete();
          $rootScope.hitInProgress = false;
          if(status == 401){
          $rootScope.removeToken();
        }else{
          if (typeof data === 'string')
          var data = JSON.parse(data);
          $rootScope.openToast('error', data.message, '');
        }
        })
    }
  })
  //=================================================
  // Manage posting
  //=================================================

  .controller('managePostingCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {
    $rootScope.checkPractinaToken();
    $rootScope.hitInProgress = false;
    ngDialog.close();
    var headers = {
      'authorization': 'bearer ' + localStorage.getItem('accessToken')
    };

    var imageName = "";
    $scope.uploadFiles = function(File) {
      $scope.postFile = File[0];
      imageName = $scope.postFile;
    }

    //Get user industry dropdown values
      $http.get(api.url + "/api/user/getIndustries", {
        headers: headers
      }).success(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        $timeout(function() {
          $scope.industrytype1 = data.data;
        });
      }).error(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('error', 'Error In Industry', '');
      }
      });


    $scope.postData = {};
    // Get Post data into database
    $scope.initTable = function() {
      $http.get(api.url + "/api/user/getMyPosts", {
        headers: headers
      }).success(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        $timeout(function() {
          $scope.postData = data.data.data;
          $scope.postDatas = data.data.data;
          //Pagination
          $scope.totalItems = $scope.postData.length;
          $scope.currentPage = 1;
          $scope.itemsPerPage = 4;
          $scope.maxSize = 2;
          //Number of pager buttons to show
          $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
          };
          $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
          };
          $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1;
          }
        })
      }).error(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('error', data.message, '');
      }
      });

    }
    $scope.initTable();


    //Filters accordingly industryId
    $scope.industryVal = function(name) {
      if($scope.industryDetail != null){

        $scope.industry_type_name = $scope.industryDetail.name;
        $scope.industry_type_id = $scope.industryDetail._id;
        $scope.finalData = [];

          for (i = 0; $scope.postData.length > i; i++) {
            if ($scope.industry_type_id == $scope.postData[i].industry._id) {
              $scope.finalData.push($scope.postData[i]);
            }
          }
          $scope.postDatas = [];
          $scope.postDatas = $scope.finalData;
          if ($scope.postDatas.length == 0) {
            $rootScope.openToast('error', 'No Data Available', '');
          }

          if ($scope.postDatas.length > 4) {
            $scope.itemsPerPage = 4;
          } else {
            $scope.itemsPerPage = $scope.totalItems;
          }
    }else{
        $scope.initTable();
    }
    }

    //Edit Post Data
    $scope.editPostFun = function(postData, index) {
      $scope.postdata = postData[index];
      console.log('post data is : ', $scope.postdata);
      if ($scope.postdata.content == 'TEXTANDIMAGE') {
        $rootScope.removeImageField = true;
      }
      if ($scope.postdata.content == 'IMAGE') {
        $rootScope.removeImageField = true;
      }
      if ($scope.postdata.content == 'TEXT') {
        $rootScope.removeImageField = false;
      }
      ngDialog.openConfirm({
        template: 'editPostData',
        className: 'ngdialog-theme-default largePop',
        scope: $scope
      }).then(function(value) {}, function(reason) {

      });
    };
    $scope.industryId = '';
    $scope.industrySelected = false;
    $scope.industryValFn = function(industryname, id) {
      $scope.industry_type_option = industryname;
      $scope.industryId = id;
      $scope.industrySelected = true;
    };

    $scope.postdata = {};
    $scope.updatePost = function() {
      $rootScope.hitInProgress = true;
      cfpLoadingBar.start();
      if ($scope.industrySelected == true) {
        $scope.industryId = $scope.industryId;
      } else {
        $scope.industryId = $scope.postdata.industry._id;
      }
      var form = new FormData();
      form.append('postId', $scope.postdata._id);
      form.append('title', $scope.postdata.title);
      form.append('content', $scope.postdata.content);
      form.append('postType', $scope.postdata.postType);
      form.append('text', $scope.postdata.text);
      form.append('industryId', $scope.industryId);
      form.append('hashtags', $scope.postdata.hashtags);
      form.append('image', $scope.postFile);

      $http.put(api.url + "/api/user/updatePost", form, {
        transformRequest: angular.identity,
        headers: {
          'authorization': 'bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': undefined
        }
      }).success(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        $timeout(function() {
          ngDialog.close();
          $rootScope.openToast('success', 'Post Updated Successfully', '');
          $scope.initTable();
        });
      }).error(function(data, status) {
        $rootScope.hitInProgress = false;
        ngDialog.close();
        cfpLoadingBar.complete();
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('success', data.message, '');
      }
      });
    }
    //Delete Post Data
    $scope.deletePostConfirm = function(id) {
      $scope.postDeleteId = id;
      ngDialog.openConfirm({
        template: 'delete_post_modal',
        className: 'ngdialog-theme-default smallPop',
        scope: $scope
      }).then(function(value) {}, function(reason) {});
    }

    $scope.deletePostData = function(id) {
      $http.put(api.url + "/api/user/deleteMyPost", {
        postId: id
      }, {
        headers: headers
      }).success(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        $scope.initTable();
        ngDialog.close();
        $rootScope.openToast('success', 'Post is Deleted Successfully', '');
      }).error(function(data, status) {
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        ngDialog.close();
        if(status == 401){
          $rootScope.removeToken();
        }else{
        $rootScope.openToast('error', data.message, '');
      }
      });
    }


  })
  // -------------------------------------
  // Manage Industry Page
  // -------------------------------------

  .controller('manageIndustryCtrl', function($timeout, $state, $scope, $http, $rootScope, api, ngDialog, cfpLoadingBar) {
    $rootScope.checkPractinaToken();
    $rootScope.hitInProgress = false;
    ngDialog.close();
    cfpLoadingBar.start();
    var headers = {
      'authorization': 'bearer ' + localStorage.getItem('accessToken')
    };

    $scope.hrefAddIndustry = function() {
      $state.go('app.addindustry');
    }

    $scope.industrytype = {};
    $scope.getind = function() {
      $http.get(api.url + "/api/user/getIndustries", {
          headers: headers
        }).success(function(data, status) {
          if (typeof data === 'string')
            var data = JSON.parse(data);
          cfpLoadingBar.complete(); console.log('industry data : ',data);
          $timeout(function() {
            $scope.industrytype = data.data;
            //Pagination
            $scope.totalItems = $scope.industrytype.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 19;
            $scope.maxSize = 3; //Number of pager buttons to show

            $scope.setPage = function(pageNo) {
              $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
              console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function(num) {
              $scope.itemsPerPage = num;
              $scope.currentPage = 1; //reset to first paghe
            }

          })
        })
        .error(function(data, status) {
          cfpLoadingBar.complete();
          $rootScope.hitInProgress = false;
          if(status == 401){
          $rootScope.removeToken();
        }else{
          if (typeof data === 'string')
            var data = JSON.parse(data);
            $rootScope.openToast('error', data.message, '');
          }
        });
    }
    $scope.getind();

    //Block/Unblock Industry POP Up
    $scope.blockUnblockIndustry = function(id, data) {
      $scope.id = id;
      $scope.data = data;
      ngDialog.open({
        template: 'blockUnblockIndBox',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    };

    //Block/UnBlock Industry
    $scope.blockindr = function(id, block) {
      $rootScope.hitInProgress = true;
      $http.put(api.url + "/api/user/blockUnblockIndustry", {
        "industryId": id,
        "block": block
      }, {
        headers: headers
      }).success(function(data, status) {
        if (block == true) {

          ngDialog.close();
          $rootScope.openToast('success', 'Industry Blocked', '');
        } else {
          ngDialog.close();
          $rootScope.openToast('success', 'Industry UnBlocked', '');
        }
        $scope.getind();
        $rootScope.hitInProgress = false;
        cfpLoadingBar.complete();
      }).error(function(data,status){
        cfpLoadingBar.complete();
        $rootScope.hitInProgress = false;
        if(status == 401){
          $rootScope.removeToken();
        }
      });
    }


  })
