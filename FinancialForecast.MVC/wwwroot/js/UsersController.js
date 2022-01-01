axios.defaults.baseURL = baseURL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';




var UsersController = new Vue({
    el: "#users",
    data: {
        errorMessage: false,
        alertMessage: '',
        userCount: 0,
        startRange: 0,
        endRange: 0,
        query: '',
        selectedUser: null,
        selectedUserID: '',
        users: []
    },
    computed: {
        "columns": function columns() {
            if (this.users.length === 0) {
                return [];
            }
            return Object.keys(this.users[0]);
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/users/all').then(function (response) {
            try {
                this.users = response.data;
                this.filteredUsers = response.data;
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                UsersController.alertErrorMessage(error.response.data);
                console.log(error);
            });
    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            UsersController.errorMessage = false;
            UsersController.alertMessage = text;
            setTimeout(function () { UsersController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            UsersController.errorMessage = true;
            UsersController.alertMessage = text;
            setTimeout(function () { UsersController.alertMessage = '' }, 3000);
        },
        "getUsers": function getUsers() {
            var start = (this.currentPage - 1) * this.elementsPerPage;
            var end = start + this.elementsPerPage;

            this.startRange = start;
            if (start + this.elementsPerPage > this.userCount)
                this.endRange = this.userCount;
            else
                this.endRange = start + this.elementsPerPage;

            if (this.filteredUsers.length > 0) {
                this.userCount = this.filteredUsers.length;
                return this.filteredUsers.slice(start, end);
            }
            else if (this.filteredUsers.length === 0 && this.query) {
                this.userCount = 0;
                return [];
            }

            else {
                this.userCount = this.users.length;
                this.filteredUsers = this.users;
                return this.users.slice(start, end);
            }
        },

        "openCreateModal": function openCreateModal() {
            CreateModalController.openCreateModal();
        },
        "openEditModal": function openEditModal() {
            if (this.selectedUser !== null)
                EditModalController.openEditModal(this.selectedUser);
        },
        "refreshTable": function refreshTable() {
            axios.get(baseURL + 'api/users/all').then(function (response) {
                try {
                    this.users = response.data;
                    this.filteredUsers = response.data;
                    this.resortTable();

                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        

        },
        
        "resetAlertMessage": function resetAlertMessage() {
            UsersController.errorMessage = false;
            UsersController.alertMessage = '';
        },
        "userClicked": function userClicked(user) {
            this.selectedUserID = user.UserID;
            this.selectedUser = user;

            axios.get(baseURL + 'api/users/permissions/' + UsersController.selectedUserID).then(function (response) {
                try {
                    this.permissions = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    },

});

var CreateModalController = new Vue({
    el: "#userCreateModal",
    data: {
        user: {},
    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.user = {}
        },
        "createNewUser": function createNewUser() {
            axios.post(baseURL + 'api/users/new', this.user).then(function (response) {
                try {
                    UsersController.alertSuccessMessage("User was successfully added");
                    UsersController.refreshTable();
                }
                catch (error) {
                    UsersController.refreshTable();
                    UsersController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                UsersController.refreshTable();
                UsersController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            UsersController.refreshTable();
            this.user = [];
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('create-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                    else {
                        form.classList.add('was-validated');
                        CreateModalController.createNewUser();
                        $('#userCreateModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#userCreateModal").submit(function (event) {
            event.preventDefault();
        });
    }
});

var EditModalController = new Vue({
    el: "#userEditModal",
    data: {
        editedUser: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openEditModal": function openEditModal(user) {
            this.editedUser = user;
        },
        "editSelectedUser": function editSelectedUser() {
            axios.post(baseURL + 'api/users/edit/' + UsersController.selectedUserID, this.editedUser).then(function (response) {
                try {
                    UsersController.alertSuccessMessage("Changes were successful");
                    UsersController.refreshTable();
                }
                catch (error) {
                    UsersController.refreshTable();
                    UsersController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                UsersController.refreshTable();
                UsersController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            UsersController.refreshTable();
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('edit-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        form.classList.add('was-validated');
                    }
                    else {
                        form.classList.add('was-validated');
                        EditModalController.editSelectedUser();
                        $('#userEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#userEditModal").submit(function (event) {
            event.preventDefault();
        });


    }
});


//var SecurityModalController = new Vue({
//    el: "#userSecurityModal",
//    data: {
//        User: {},
//        error: false,
//        errorMessage: ''
//    },
//    methods: {
//        "openSecurityModal": function openSecurityModal(user) {
//            this.User = user
//            this.User.Password = '';
//            this.User['Security Answer'] = '';
//            this.User['Security Question'] = 1;
//        },
//        "submitSecurityInfo": function submitSecurityInfo() {
//            axios.post(baseURL + 'api/users/editSecurityInfo/' + UsersController.selectedUserID, this.User).then(function (response) {
//                try {
//                    UsersController.alertSuccessMessage("Changes were successful");
//                    UsersController.refreshTable();
//                }
//                catch (error) {
//                    UsersController.refreshTable();
//                    UsersController.alertErrorMessage(error);
//                    console.log(error);
//                }
//            }).catch(function (error) {
//                UsersController.refreshTable();
//                UsersController.alertErrorMessage(error.response.data);
//                console.log(error);
//            });
//        },
//        "resetForm": function resetForm() {
//            UsersController.refreshTable();
//        }
//    },
//    mounted: function () {
//        'use strict';
//        window.addEventListener('load', function () {
//            // Fetch all the forms we want to apply custom Bootstrap validation styles to
//            var forms = document.getElementsByClassName('security-validation');
//            // Loop over them and prevent submission
//            var validation = Array.prototype.filter.call(forms, function (form) {
//                form.addEventListener('submit', function (event) {
//                    if (form.checkValidity() === false) {
//                        event.preventDefault();
//                        event.stopPropagation();
//                        form.classList.add('was-validated');
//                    }
//                    else {
//                        form.classList.add('was-validated');
//                        SecurityModalController.submitSecurityInfo();
//                        $('#userSecurityModal').modal('hide');
//                        form.classList.remove('was-validated');
//                    }
//                }, false);
//            });
//        }, false);

//        $("#userSecurityModal").submit(function (event) {
//            event.preventDefault();
//        });


//    }
//});

