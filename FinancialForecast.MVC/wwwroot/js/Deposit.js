axios.defaults.baseURL = baseURL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.headers.common = {
    "Content-Type": "application/json"
}



var DepositsController = new Vue({
    el: "#Deposits",
    data: {
        errorMessage: false,
        alertMessage: '',
        DepositCount: 0,
        startRange: 0,
        endRange: 0,
        query: '',
        selectedDeposit: null,
        selectedDepositID: '',
        Deposits: []
    },
    computed: {
        "columns": function columns() {
            if (this.Deposits.length === 0) {
                return [];
            }
            return Object.keys(this.Deposits[0]);
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/Deposits/all').then(function (response) {
            try {
                this.Deposits = response.data;
                console.log(this.Deposits);
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            DepositsController.errorMessage = false;
            DepositsController.alertMessage = text;
            setTimeout(function () { DepositsController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            DepositsController.errorMessage = true;
            DepositsController.alertMessage = text;
            setTimeout(function () { DepositsController.alertMessage = '' }, 3000);
        },
        "getDeposits": function getDeposits() {
            return this.Deposits.slice(start, end);
        },

        "openCreateModal": function openCreateModal() {
            CreateModalController.openCreateModal();
        },
        "openEditModal": function openEditModal() {
            if (this.selectedDeposit !== null)
                EditModalController.openEditModal(this.selectedDeposit);
        },
        "refreshTable": function refreshTable() {
            axios.get(baseURL + 'api/Deposits/all').then(function (response) {
                try {
                    this.Deposits = response.data;
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
            DepositsController.errorMessage = false;
            DepositsController.alertMessage = '';
        },
        "DepositClicked": function DepositClicked(Deposit) {
            this.selectedDepositID = Deposit.DepositID;
            this.selectedDeposit = Deposit;
            console.log(Deposit);
        }
    },

});

var CreateModalController = new Vue({
    el: "#DepositCreateModal",
    data: {
        Deposit: {},

    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.Deposit = {}
            this.Deposit.Date = new Date().getDate();
        },
        "createNewDeposit": function createNewDeposit() {
            console.log(this.Deposit);
            axios.post(baseURL + 'api/deposits/new', this.Deposit).then(function (response) {
                try {
                    console.log("Deposit was successfully added");
                    DepositsController.alertSuccessMessage("Deposit was successfully added");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            DepositsController.refreshTable();
            this.Deposit = [];
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
                        CreateModalController.createNewDeposit();
                        $('#DepositCreateModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#DepositCreateModal").submit(function (event) {
            event.preventDefault();
        });
    }
});

var EditModalController = new Vue({
    el: "#DepositEditModal",
    data: {
        editedDeposit: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openEditModal": function openEditModal(Deposit) {
            console.log(Deposit);
            this.editedDeposit = Deposit;
        },
        "editSelectedDeposit": function editSelectedDeposit() {
            axios.post(baseURL + 'api/Deposits/edit/' + DepositsController.selectedDepositID, this.editedDeposit).then(function (response) {
                try {
                    DepositsController.alertSuccessMessage("Changes were successful");
                    DepositsController.refreshTable();
                }
                catch (error) {
                    DepositsController.refreshTable();
                    DepositsController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                DepositsController.refreshTable();
                DepositsController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            DepositsController.refreshTable();
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
                        EditModalController.editSelectedDeposit();
                        $('#DepositEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#DepositEditModal").submit(function (event) {
            event.preventDefault();
        });


    }
});


//var SecurityModalController = new Vue({
//    el: "#DepositSecurityModal",
//    data: {
//        Deposit: {},
//        error: false,
//        errorMessage: ''
//    },
//    methods: {
//        "openSecurityModal": function openSecurityModal(Deposit) {
//            this.Deposit = Deposit
//            this.Deposit.Password = '';
//            this.Deposit['Security Answer'] = '';
//            this.Deposit['Security Question'] = 1;
//        },
//        "submitSecurityInfo": function submitSecurityInfo() {
//            axios.post(baseURL + 'api/Deposits/editSecurityInfo/' + DepositsController.selectedDepositID, this.Deposit).then(function (response) {
//                try {
//                    DepositsController.alertSuccessMessage("Changes were successful");
//                    DepositsController.refreshTable();
//                }
//                catch (error) {
//                    DepositsController.refreshTable();
//                    DepositsController.alertErrorMessage(error);
//                    console.log(error);
//                }
//            }).catch(function (error) {
//                DepositsController.refreshTable();
//                DepositsController.alertErrorMessage(error.response.data);
//                console.log(error);
//            });
//        },
//        "resetForm": function resetForm() {
//            DepositsController.refreshTable();
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
//                        $('#DepositSecurityModal').modal('hide');
//                        form.classList.remove('was-validated');
//                    }
//                }, false);
//            });
//        }, false);

//        $("#DepositSecurityModal").submit(function (event) {
//            event.preventDefault();
//        });


//    }
//});

