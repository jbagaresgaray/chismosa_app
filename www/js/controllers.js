var ctrl = angular.module('todo.controllers', []);

ctrl.controller('SignupCtrl', function ($scope, $ionicNavBarDelegate) {
  console.log('SignupCtrl');
  $scope.goBack = function () {
    $ionicNavBarDelegate.back();
  };
});

ctrl.controller('LoginCtrl', function ($scope, $stateParams, $ionicModal, $location, $ionicPopup,$ionicLoading, LoginFactory) {
  console.log('LoginCtrl');
  $scope.login = {};
  $scope.doLogin = function () {

    $ionicLoading.show({
      template: 'Loading...'
    });

    LoginFactory.query($scope.login)
      .success(function (data) {
        console.log('data');
        console.log(data);
        if (data) {
          if (data[0].success == true && (data[0].users.length) > 0) {
            console.log(data[0].users[0]);

            $ionicLoading.hide();

            $scope.users = data[0].users[0];
            window.localStorage['users'] = JSON.stringify(data[0].users[0]);
            console.log('$location.path(home);');
            $location.path('/app/home');

          } else if (data[0].success == true && (data[0].users.length) == 0) {
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Error',
              template: 'No user existed with that account'
            });

          } else if (data[0].success == false && (data[0].message.length) > 0) {

            if (data[0]) {
              if (data[0].message.mobile_number) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message.mobile_number.msg
                });
              } else if (data[0].message.password) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message.password.msg
                });
              }else{
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message
                });
              }
            } else {
              $ionicLoading.hide();

              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message
              });
            }
          }
        } else {
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: 'Error',
            template: 'No user existed with that account'
          });
        }
      })
      .error(function (error) {
        $ionicLoading.hide();

        $ionicPopup.alert({
          title: 'Error',
          template: error[0].message
        });
        return;
      });
  };
  $scope.doSignUp = function () {
    $location.path('/signup');
  }
});

ctrl.controller('AppCtrl', function ($scope, $stateParams, $ionicModal, $ionicLoading, $location) {
  console.log('AppCtrl');

  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.searchmodal = $ionicModal;
  });
  $scope.openSearch = function () {
    console.log('openSearch');
    $scope.searchmodal.show();
  };
  $scope.closeSearch = function () {
    console.log('closeCompose');
    $scope.searchmodal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.searchmodal.remove();
  });

  $scope.logoutApp = function () {
    window.localStorage.removeItem("users");
    $location.path('/login');
  }

  function getUserProfile() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    var users = JSON.parse(window.localStorage['users'] || '{}');
    $scope.profile = users;
    if (users.pic_blob) {
       $scope.profilePic = "data:image/png;base64," + (users.pic_blob);
    } else {
      $scope.profilePic = "img/photo.png";
    }

    $ionicLoading.hide();
  }

  getUserProfile();

});
ctrl.controller('ProfileCtrl', function ($scope, $ionicPopup, $ionicLoading) {
  console.log('ProfileCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $scope.showName = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.name">',
      title: 'Set Name',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.data.name) {
            e.preventDefault();
          } else {
            return $scope.data.name;
          }
        }
            }, ]
    });
  };
  $scope.showPicOption = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item" ng-click="showProfilePic()">Profile Photo</a>\
                <a class="item" ng-click="showCoverPic()">Cover Photo</a>\
                </div>',
      title: 'Set Profile/Cover Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showProfilePic = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a>\
                <a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a>\
                <a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a>\
                </div>',
      title: 'Set Profile Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showCoverPic = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a>\
                <a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a>\
                <a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a>\
                </div>',
      title: 'Set Cover Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showStatus = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<textarea id="message" ng-model="data.status" style="overflow:hidden;height:80px;" ng-trim="false" maxlength="450" row="4" column="10"></textarea>\
                    <span>{{200 - data.status.length}}</span>',
      title: 'Set Status',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Delete</b>',
        type: 'button-assertive',
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.data.status) {
            e.preventDefault();
          } else {
            return $scope.data.status;
          }
        }
            }, ]
    });
  };
  $scope.showMobile = function () {
    $scope.data = users;

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.mobile_number">',
      title: 'Edit Mobile Number',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.data.number) {
            e.preventDefault();
          } else {
            return $scope.data.number;
          }
        }
            }, ]
    });
  };
  $scope.showEmail = function () {
    $scope.data = users;
    var myPopup = $ionicPopup.show({
      template: '<input type="email" ng-model="data.email">',
      title: 'Edit Email Address',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.data.email) {
            e.preventDefault();
          } else {
            return $scope.data.email;
          }
        }
            }, ]
    });
  };

  function getUserProfile() {
    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.profile = users;
    if (users.pic_blob) {
       $scope.profilePic = "data:image/png;base64," + (users.pic_blob);
    } else {
      $scope.profilePic = "img/photo.png";
    }

    $ionicLoading.hide();
  }



  getUserProfile();
});

ctrl.controller('SearchCtrl', function ($scope) {
  console.log('SearchCtrl');
});

ctrl.controller('MsgCtrl', function ($scope, $ionicModal, $ionicLoading, ContactsFactory) {
  console.log('MsgCtrl');

  $ionicModal.fromTemplateUrl('templates/compose.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.composeModal = $ionicModal;
  });
  $scope.compose = function () {
    console.log('compose');
    $scope.composeModal.show();
  };
  $scope.closeCompose = function () {
    console.log('closeCompose');
    $scope.composeModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.composeModal.remove();
  });


  $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.messagedetail = $ionicModal;
  });
  $scope.openMessageDetail = function () {
    console.log('openMessageDetail');
    $scope.messagedetail.show();
  };
  $scope.composeMessage = function () {
    console.log('openMessageDetail');
    $scope.messagedetail.show();
  };
  $scope.closeMessageDetail = function () {
    console.log('closeMessageDetail');
    $scope.messagedetail.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.messagedetail.remove();
  });

  $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.profilemodal = $ionicModal;
  });
  $scope.profile = function () {
    console.log('profile');
    $scope.profilemodal.show();
  };
  $scope.closeprofile = function () {
    console.log('closeprofile');
    $scope.profilemodal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.profilemodal.remove();
  });

  $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.createModal = $ionicModal;
  });
  $scope.modifyContact = function () {
    console.log('openCreateContact');
    $scope.createModal.show();
  };
  $scope.closeCreateContact = function () {
    console.log('closeCreateContact');
    $scope.createModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.createModal.remove();
  });


  function getContacts() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    var users = JSON.parse(window.localStorage['users'] || '{}');
    ContactsFactory.query(users.id)
      .success(function (data) {
        $scope.contacts = data;
        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

  $scope.messages = [{
    id: 1,
    name: 'Jane Doe',
    content: 'Yea, it\'s pretty sweet',
    date: 'Jul 14'
    }, {
    id: 2,
    name: 'Jane Doe',
    content: 'Yea, it\'s pretty sweet',
    date: 'Jul 14'
    }, {
    id: 3,
    name: 'Jane Doe',
    content: 'Yea, it\'s pretty sweet',
    date: 'Jul 14'
    }, {
    id: 4,
    name: 'Jane Doe',
    content: 'Yea, it\'s pretty sweet',
    date: 'Jul 14'
    }];
  var messageOptions = [{
    message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Is this magic? <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }];
  var messageIter = 0;
  $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);

  getContacts();
});

ctrl.controller('ContactsCtrl', function ($scope, $ionicModal, $ionicPopup, $location, $ionicLoading, ContactsFactory) {
  console.log('ContactsCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.profileModal = $ionicModal;
  });
  $scope.openProfile = function (id) {
    console.log('openProfile');

    getContactDetails(users.id, id);
    $scope.profileModal.show();
  };
  $scope.closeprofile = function () {
    console.log('closeprofile');
    $scope.profileModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.profileModal.remove();
  });

  $scope.$on('profileModal.hidden', function () {});
  $scope.$on('profileModal.removed', function () {});

  $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.createModal = $ionicModal;
  });
  $scope.openCreateContact = function () {
    console.log('openCreateContact');
    $scope.createModal.show();
  };
  $scope.modifyContact = function () {
    console.log('modifyContact');
    $scope.createModal.show();
  };
  $scope.closeCreateContact = function () {
    console.log('closeCreateContact');
    $scope.createModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.createModal.remove();
  });


  $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.messagedetail = $ionicModal;
  });
  $scope.composeMessage = function () {
    console.log('openMessageDetail');
    $scope.messagedetail.show();
  };
  $scope.closeMessageDetail = function () {
    console.log('closeMessageDetail');
    $scope.messagedetail.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.messagedetail.remove();
  });


  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.searchmodal = $ionicModal;
  });
  $scope.openSearch = function () {
    console.log('openSearch');
    getContacts();
    $scope.searchmodal.show();
  };
  $scope.closeSearch = function () {
    console.log('closeCompose');
    $scope.searchmodal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.searchmodal.remove();
  });

  $scope.saveContacts = function () {
    console.log('callback for ng-click saveContacts:');

    $scope.newcontact.user_id = users.id;
    ContactsFactory.checkExisting($scope.newcontact.mobile_number)
      .success(function (data) {
        console.log(data);
        if (data[0].success == true) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Contact Information already existed!'
          });
        } else {
          ContactsFactory.create($scope.newcontact)
            .success(function (res) {
              console.log(res);
              if (res[0].success == true) {
                $ionicPopup.alert({
                  title: 'Record save',
                  template: res[0].message
                });
                $location.path('/app/contact');
              } else {
                $ionicPopup.alert({
                  title: 'Error',
                  template: res[0].message
                });
              }
            })
            .error(function (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error[0].message
              });
              return;
            });
        }
      })
      .error(function (error) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'An error occur while checking the mobile number'
        });
        return;
      });
  };

  function getContacts() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    ContactsFactory.query(users.id)
      .success(function (data) {
        $scope.contacts = data;
        //                $scope.newcontact = {};
        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

  function getContactDetails(user_id, id) {
    console.log('getContactDetails');
    $ionicLoading.show({
      template: 'Loading...'
    });
    ContactsFactory.showdetail(user_id, id)
      .success(function (data) {
        console.log(data);
        $scope.profiledetail = data[0];
        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }


  var messageOptions = [{
    message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }, {
    message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
    }, {
    message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
    }, {
    message: '<p>Is this magic? <br>1:50 PM</p>'
    }, {
    message: '<p>Am I dreaming? <br>1:50 PM</p>'
    }];
  var messageIter = 0;
  $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);

  getContacts();
});
