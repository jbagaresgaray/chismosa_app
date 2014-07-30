'use strict';

var ContactsCtrl = function ($scope, $ionicModal, $ionicPopup, $location, $ionicLoading, $timeout, $ionicScrollDelegate,
  ContactsFactory, ChatsFactory, UsersFactory, NotifFactory) {
  console.log('ContactsCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');
  $scope.searchKey = "";

  $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.profileModal = $ionicModal;
  });
  $scope.openProfile = function (id) {
    console.log('openProfile' + id);
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


  $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.messagedetail = $ionicModal;
  });
  $scope.composeMessage = function (id) {
    $scope.chat = {};

    $scope.contact_id = id;
    getContactDetails(users.id, id);
    getChatDetail(id);
    $scope.messagedetail.show();
  };
  $scope.closeMessageDetail = function () {
    console.log('closeMessageDetail');
    $scope.messagedetail.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.messagedetail.remove();
  });

  $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.createModal = $ionicModal;
  });
  $scope.openCreateContact = function () {
    console.log('openCreateContact');

    $scope.state = 'create';
    $scope.newcontact = {};

    $scope.createModal.show();
  };
  $scope.modifyContact = function () {
    console.log('modifyContact');
    $scope.createModal.show();
  };
  $scope.closeCreateContact = function () {
    console.log('closeCreateContact');

    getContacts();

    $scope.createModal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.createModal.remove();
  });


  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.searchmodal = $ionicModal;
  });
  $scope.openSearch = function () {
    console.log('openSearch');
    $scope.searchKey = "";
    $scope.users = {};
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

                $scope.closeCreateContact();

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

  $scope.updateContacts = function () {
    console.log('updateContacts');

    $scope.newcontact.user_id = users.id;

    ContactsFactory.create($scope.newcontact)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Record save',
            template: res[0].message
          });
          $location.path('/app/contact');
          console.log('$location.path(app/contact);');
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
  };


  $scope.showConfirm = function (id) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Consume Ice Cream',
      template: 'Are you sure you want to eat this ice cream?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        console.log('You are sure');

        $ionicLoading.show({
          template: 'Deleting...'
        });
        console.log(users.id + ';' + id);

        ContactsFactory.deleteContacts(users.id, id)
          .success(function (res) {
            console.log(res);
            if (res[0].success == true) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Delete',
                template: res[0].message
              });
              $scope.closeprofile();
              getContacts();
            } else {
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Error',
                template: res[0].message
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
      }
    });
  };

  $scope.submitChat = function (receiver_id) {
    console.log('receiver_id: ' + receiver_id);

    $scope.chat.receiver_id = receiver_id;
    $scope.chat.user_id = users.id;
    $scope.chat.from = users.id;

    console.log($scope.chat);

    ChatsFactory.send($scope.chat)
      .success(function (data) {
        console.log(data);
        if (data[0].success === false) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: data[0].message.message.msg
          });
        } else {
          getChatDetail(receiver_id);
          $scope.chat.chatmessage = "";
        }
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  };

  $scope.search = function (searchKey) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('search ctrl');

    $scope.searchKey = {};
    $scope.searchKey.searchKey = searchKey;
    $scope.searchKey.user_id = users.id;

    UsersFactory.search($scope.searchKey)
      .success(function (data) {
        console.log(data);
        $scope.users = {};
        if (data.length > 0) {
          if (data[0].success === false) {
            if (data[0].message.searchKey) {
              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message.searchKey.msg
              });
              $ionicLoading.hide();
              return;
            }
          } else {
            $scope.users = data;
            console.log('users');
            console.log(data);
            $ionicLoading.hide();
          }
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'No record to display'
          });
        }
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
      });
  };

  $scope.doRefreshSearch = function (searchKey) {
    console.log('Refreshing search!');

    $scope.searchKey = {};
    $scope.searchKey.searchKey = searchKey;
    $scope.searchKey.user_id = users.id;

    UsersFactory.search($scope.searchKey)
      .success(function (data) {
        console.log(data);
        $scope.users = {};
        if (data.length > 0) {
          if (data[0].success === false) {
            if (data[0].message.searchKey) {
              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message.searchKey.msg
              });
              $ionicLoading.hide();
              return;
            }
          } else {
            $scope.users = data;
            console.log('users');
            console.log(data);
            $ionicLoading.hide();
          }
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'No record to display'
          });
        }
      })
      .error(function (error) {
        console.log(error);
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };


  function getContacts() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    ContactsFactory.query(users.id)
      .success(function (data) {
        $scope.contacts = {};
        $scope.contacts = data;
        console.log(data);
        window.localStorage['contacts'] = JSON.stringify(data);
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
    console.log('user_id: ' + user_id);
    console.log('id: ' + id);
    $scope.newcontact = {};
    $scope.profiledetail = {};
    ContactsFactory.showdetail(user_id, id)
      .success(function (data) {
        console.log('getContactDetails data');
        console.log(data);

        $scope.profiledetail = data[0];
        $scope.contact_id = data[0].id;
        $scope.newcontact.name = data[0].contact_name;
        $scope.newcontact.areacode = data[0].contact_areacode;
        $scope.newcontact.mobile_number = data[0].contact_number;
        $scope.newcontact.email = data[0].contact_email;
        $scope.state = 'update';

        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

  $scope.doRefreshContacts = function () {
    console.log('Refreshing!');
    ContactsFactory.query(users.id)
      .success(function (data) {
        $scope.contacts = {};
        $scope.contacts = data;
        console.log(data);
        window.localStorage['contacts'] = JSON.stringify(data);
        $ionicLoading.hide();
        $location.path('/app/contact');
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.doRefreshMessage = function (receiver_id) {
    console.log('Refreshing! doRefreshMessage');
    ChatsFactory.query(users.id, receiver_id)
      .success(function (data) {
        if (data[0].success === true) {
          $ionicLoading.hide();

          console.log(data[0].data);

          var newValue = new Array();
          var i;
          for (i = 0; i < data[0].data.length; i++) {
            var msg = data[0].data[i].message;
            var datecreated = data[0].data[i].datecreated;
            var receiver = data[0].data[i].receiver_id;
            var user_id = data[0].data[i].user_id;
            var msg_id = data[0].data[i].id;

            var myObj = new Object();
            myObj.message = '<p>' + msg + '<br>' + datecreated + '</p>';
            myObj.user_id = user_id;
            myObj.receiver_id = receiver_id;
            myObj.id = msg_id;

            newValue.push(myObj);
          }

          var messageOptions = newValue;

          $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
          $scope.chat = {};
          $ionicScrollDelegate.scrollBottom(true);
        } else {
          $scope.messagesdetails = {};
          $scope.chat = {};
        }
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  function getChatDetail(receiver_id) {
    console.log('getChatDetail -- controllers');
    $ionicLoading.show({
      template: 'Loading...'
    });

    ChatsFactory.query(users.id, receiver_id)
      .success(function (data) {
        if (data[0].success === true) {
          $ionicLoading.hide();

          console.log(data[0].data);

          var newValue = new Array();
          var i;
          for (i = 0; i < data[0].data.length; i++) {
            var msg = data[0].data[i].message;
            var datecreated = data[0].data[i].datecreated;
            var receiver = data[0].data[i].receiver_id;
            var user_id = data[0].data[i].user_id;
            var msg_id = data[0].data[i].id;

            var myObj = new Object();
            myObj.message = '<p>' + msg + '<br>' + datecreated + '</p>';
            myObj.user_id = user_id;
            myObj.receiver_id = receiver_id;
            myObj.id = msg_id;

            newValue.push(myObj);
          }

          var messageOptions = newValue;

          $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
          $scope.chat = {};
          $ionicScrollDelegate.scrollBottom(true);
        }
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load user chat history: ' + error.message;
      });
  }

  $scope.sendFriendRequest = function (receiver_id) {
    $scope.request = {};
    $scope.request.user_id = users.id;
    $scope.request.friend_id = receiver_id;
    console.log($scope.request);
    ContactsFactory.sendRequest($scope.request)
      .success(function (data) {
        console.log(data);
        if (data[0].success === true) {
          $ionicPopup.alert({
            title: 'Notification',
            template: data[0].message
          });
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: data[0].message
          });
        }

      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load user chat history: ' + error.message;
      });
  }


  $scope.denyRequest = function (notif_id) {
    console.log('denyRequest' + notif_id);
  }


  $scope.doRefresh = function () {
    console.log('Refreshing!');
    $scope.notifs = {};
    NotifFactory.query(users.id)
      .success(function (data) {
        console.log(data);
        if (data[0].success === true) {
          $scope.notifs = data[0].notif;
        }
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  function getNotification() {
    console.log('getNotification');
    $scope.notifs = {};
    NotifFactory.query(users.id)
      .success(function (data) {
        console.log(data);
        if (data[0].success === true) {
          $scope.notifs = data[0].notif;
        }
      })
      .error(function (error) {
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }


  getContacts();
  getNotification();

};


Application.Controllers.controller('ContactsCtrl', ['$scope', '$ionicModal', '$ionicPopup', '$location', '$ionicLoading', 'ContactsFactory', ContactsCtrl]);
