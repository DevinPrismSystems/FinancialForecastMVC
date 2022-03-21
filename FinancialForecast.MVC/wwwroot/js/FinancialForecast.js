axios.defaults.baseURL = baseURL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.headers.common = {
    "Content-Type": "application/json"
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

var today = new Date()
var initialEndDate = new Date(today.addDays(14));
const serverBus = new Vue();

var ForecastController = new Vue({
    el: "#Forecast",
    data: {
        errorMessage: false,
        alertMessage: '',
        todaysAmount: 0,
        //DepositCount: 0,
        //startRange: 0,
        //endRange: 0,
        selectedItem: null,
        selectedItemID: '',
        financialItemKeys: [],
        Deposits: [],
        Withdrawals: [],
        ForecastedItems: [],
        SumOfDeposits: 0,
        SumOfWithdrawals: 0,
        NetDifference: 0,
        StringNetDifference: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: initialEndDate.toISOString().slice(0, 10),
        SelectedDateID: 1,
        options: [{
            id: 1, text: 'Next Two Weeks'
        },
        {
            id: 2, text: 'This Month'
        },
        {
            id: 3, text: 'Next Month'
        },
        {
            id: 4, text: 'Next 3 Months'
        },
        {
            id: 5, text: 'Next 6 Months'
        }]
    },
    computed: {
        "columns": function columns() {
            return Object.keys(this.financialItemKeys)
        },
        "isDeposit": function isDeposit() {
            if (this.selectedItem === null) {
                return true;
            }
            else {
                if (this.selectedItem.Amount < 0)
                    return true;
                else
                    return false;
            }
        },
        "isWithdrawal": function isWithdrawal() {
            if (this.selectedItem === null) {
                return true;
            }
            else {
                if (this.selectedItem.Amount > 0)
                    return true;
                else
                    return false;
            }
        }
    },
    mounted: function () {
        axios.get(baseURL + 'api/Forecast/getFinancialProfile').then(function (response) {
            try {
                this.todaysAmount = response.data;
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });

        axios.get(baseURL + 'api/forecast/getForecastColumns').then(function (response) {
            try {
                this.financialItemKeys = response.data;
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (error) {
                return [];
            });


        this.getAPIForecasItems();

        //this.sortItems();
        //this.calculateRemainingBalance();
        console.log(this.ForecastedItems);
    },
    methods: {
        "alertSuccessMessage": function alertSuccessMessage(text) {
            //Notification.requestPermission();
            //var notification = new Notification("Hi there!", { body: "some text" });
            //setTimeout(notification.close.bind(notification), 10000);

            ForecastController.errorMessage = false;
            ForecastController.alertMessage = text;
            setTimeout(function () { ForecastController.resetAlertMessage() }, 5000);
        },
        "alertErrorMessage": function alertErrorMessage(text) {
            ForecastController.errorMessage = true;
            ForecastController.alertMessage = text;
            setTimeout(function () { ForecastController.alertMessage = '' }, 3000);
        },
        "getAPIForecasItems": function getAPIForecasItems() {
            axios.get(baseURL + 'api/forecast/getItems/' + this.startDate + '/' + this.endDate).then(function (response) {
                try {
                    this.ForecastedItems = response.data;
                    this.SumOfDeposits = 0;
                    this.SumOfWithdrawals = 0;
                    for (let i = 0; i < this.ForecastedItems.length; i++) {
                        var amount = this.ForecastedItems[i].Amount;
                        if (amount > 0) {
                            this.SumOfDeposits += amount;
                        }
                        else {
                            this.SumOfWithdrawals += Math.abs(amount);
                        }
                    }
                    this.NetDifference = this.SumOfDeposits - this.SumOfWithdrawals;


                    this.StringNetDifference = formatter.format(this.NetDifference);
                    this.SumOfWithdrawals = formatter.format(this.SumOfWithdrawals);
                    this.SumOfDeposits = formatter.format(this.SumOfDeposits);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    ForecastController.alertErrorMessage(error.response.data);
                    console.log(error);
                });


        },
        "getForecastedItems": function getForecastedItems() {

            if (this.ForecastedItems.length > 0) {
                for (let i = 0; i < this.ForecastedItems.length; i++) {
                    var amount = this.ForecastedItems[i].Amount;
                    if (amount > 0) {
                        this.ForecastedItems[i].DepositAmount = formatter.format(amount);
                    }
                    else {
                        this.ForecastedItems[i].WithdrawalAmount = formatter.format(amount);
                    }
                }

                return this.ForecastedItems;
            }
            return [];
        },
        "ItemClicked": function ItemClicked(Item) {
            if (Item.amount > 0) {
                this.selectedItemID = Item.id;
                this.selectedItem = Item;
            }
            else {
                this.selectedItemID = Item.id;
                this.selectedItem = Item;
            }
        },
        "openCreateDepositModal": function openCreateDepositModal() {
            CreateModalController.openCreateModal();
        },
        "openEditDepositModal": function openEditDepositModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount > 0)
                EditDepositModalController.openEditModal(this.selectedItem);
        },
        "openMultipleEditDepositModal": function openEditDepositModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount > 0)
                MultipleEditDepositModalController.openMultipleEditModal(this.selectedItem);
        },
        "openMultipleDeleteDepositModal": function openMultipleDeleteDepositModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount > 0)
                MultipleDeleteDepositModalController.openMultipleDeleteModal(this.selectedItem);
        },
        "openCreateWithdrawalModal": function openCreateWithdrawalModal() {
            CreateModalController.openCreateModal();
        },
        "openEditWithdrawalModal": function openEditWithdrawalModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount < 0) 
                EditWithdrawalModalController.openEditModal(this.selectedItem);
        },
        "openMultipleEditWithdrawalModal": function openEditWithdrawalModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount < 0) 
                MultipleEditWithdrawalModalController.openMultipleEditModal(this.selectedItem);
        },
        "openMultipleDeleteWithdrawalModal": function openMultipleDeleteWithdrawalModal() {
            if (this.selectedItem !== null && this.selectedItem.Amount < 0) 
                MultipleDeleteWithdrawalModalController.openMultipleDeleteModal(this.selectedItem);      
        },
        "refreshTable": function refreshTable() {
            this.getAPIForecasItems();
            this.selectedItem = null;
            this.selectedItemID = '';

        },

        "resetAlertMessage": function resetAlertMessage() {
            ForecastController.errorMessage = false;
            ForecastController.alertMessage = '';
        },
        "sortItems": function sortItems() {
            //this.currentPage = 1;
            this.ForecastedItems.sort(function (a, b) {
                if (a['Date'] > b['Date']) {
                    return 1;
                } else if (a['Date'] < b['Date']) {
                    return -1;
                }

                return 0;
            });               
        },
        "updateFinancialProfile": function updateFinancialProfile() {
            axios.post(baseURL + 'api/Forecast/updateFinancialProfile' + '/' + ForecastController.todaysAmount).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        }
    },
    watch: {
        SelectedDateID: function (value) {
            serverBus.$emit('dateSelected', this.SelectedDateID);
        },
        startDate: function (value) {
            this.refreshTable();
        },
        endDate: function (value) {
            this.refreshTable();
        }
    }
});

var CreateDepositModalController = new Vue({
    el: "#DepositCreateModal",
    data: {
        Deposit: {}
    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.Deposit = {}
            this.Deposit.Date = new Date().toISOString().slice(0, 10);
            var date = new Date();
            this.Deposit['Stop Date'] = date.addDays(365).toISOString().slice(0, 10);

            console.log(this.Deposit);
        },
        "createNewDeposit": function createNewDeposit() {
            console.log(this.Deposit);
            axios.post(baseURL + 'api/deposits/new', this.Deposit).then(function (response) {
                try {
                    console.log("Deposit was successfully added");
                    ForecastController.alertSuccessMessage("Deposit was successfully added");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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

var EditDepositModalController = new Vue({
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
        "editselectedItem": function editselectedItem() {
            axios.post(baseURL + 'api/Deposits/edit/' + ForecastController.selectedItemID, this.editedDeposit).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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
                        EditModalController.editselectedItem();
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

var MultipleEditDepositModalController = new Vue({
    el: "#DepositMultipleEditModal",
    data: {
        editedDeposit: {},
        recurringDeposits: {},
        columns: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openMultipleEditModal": function openMultipleEditModal(Deposit) {

            this.editedDeposit = Deposit;
            console.log(this.editedDeposit);

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + ForecastController.selectedItemID, Deposit).then(function (response) {
                try {
                    this.recurringDeposits = response.data;
                    console.log(this.recurringDeposits);
                    this.columns = Object.keys(response.data[0]);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });



            $("#DepositMultipleEditModal").submit(function (event) {
                event.preventDefault();
            });
        },
        "MultipleEditselectedItem": function MultipleEditselectedItem() {
            axios.post(baseURL + 'api/Deposits/multipleEdits/' + ForecastController.selectedItemID, this.editedDeposit, this.recurringDeposits).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "RemoveItem": function RemoveItem(Deposit) {
            index = this.recurringDeposits.findIndex(x => x.id === Deposit.id);
            this.recurringDeposits.splice(index, 1);
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('multipleEdit-validation');
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
                        MultipleEditModalController.MultipleEditselectedItem();
                        $('#DepositMultipleEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);


    }
});


var DeleteDepositModalController = new Vue({
    el: "#depositDeletionConfirmation",
    methods: {
        "deleteDeposit": function deleteDeposit() {
            axios.post(baseURL + 'api/deposits/deleteDeposit/' + ForecastController.selectedItemID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    }
});

var MultipleDeleteDepositModalController = new Vue({
    el: "#multipleDepositDeletionConfirmation",
    data: {
        recurringDeposits: {},
        columns: {}
    },
    methods: {
        "openMultipleDeleteModal": function openMultipleDeleteModal(Deposit) {

            axios.get(baseURL + 'api/deposits/getRecurringDeposits/' + ForecastController.selectedItemID, Deposit).then(function (response) {
                try {
                    this.recurringDeposits = response.data;
                    this.columns = Object.keys(response.data[0]);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#multipleDepositDeletionConfirmation").submit(function (event) {
                event.preventDefault();
            });
        },
        "deleteMultipleDeposits": function deleteMultipleDeposits() {
            axios.post(baseURL + 'api/deposits/deleteMultipleDeposits/' + ForecastController.selectedItemID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "RemoveItem": function RemoveItem(Deposit) {
            index = this.recurringDeposits.findIndex(x => x.id === Deposit.id);
            this.recurringDeposits.splice(index, 1);
        }
    }
});

var CreateWithdrawalModalController = new Vue({
    el: "#WithdrawalCreateModal",
    data: {
        Withdrawal: {}
    },
    methods: {
        "openCreateModal": function openCreateModal() {
            this.Withdrawal = {}
            this.Withdrawal.Date = new Date().toISOString().slice(0, 10);
            var date = new Date();
            this.Withdrawal['Stop Date'] = date.addDays(365).toISOString().slice(0, 10);

            console.log(this.Withdrawal);
        },
        "createNewWithdrawal": function createNewWithdrawal() {
            console.log(this.Withdrawal);
            axios.post(baseURL + 'api/Withdrawals/new', this.Withdrawal).then(function (response) {
                try {
                    console.log("Withdrawal was successfully added");
                    ForecastController.alertSuccessMessage("Withdrawal was successfully added");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
            this.Withdrawal = [];
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
                        CreateModalController.createNewWithdrawal();
                        $('#WithdrawalCreateModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#WithdrawalCreateModal").submit(function (event) {
            event.preventDefault();
        });
    }
});

var EditWithdrawalModalController = new Vue({
    el: "#WithdrawalEditModal",
    data: {
        editedWithdrawal: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openEditModal": function openEditModal(Withdrawal) {
            Withdrawal.Amount = Math.abs(Withdrawal.Amount);
            this.editedWithdrawal = Withdrawal;
        },
        "editselectedItem": function editselectedItem() {
            axios.post(baseURL + 'api/Withdrawals/edit/' + ForecastController.selectedItemID, this.editedWithdrawal).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
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
                        EditModalController.editselectedItem();
                        $('#WithdrawalEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);

        $("#WithdrawalEditModal").submit(function (event) {
            event.preventDefault();
        });


    }
});

var MultipleEditWithdrawalModalController = new Vue({
    el: "#WithdrawalMultipleEditModal",
    data: {
        columns: {},
        editedWithdrawal: {},
        recurringWithdrawals: {},
        error: false,
        errorMessage: ''
    },
    methods: {
        "openMultipleEditModal": function openMultipleEditModal(Withdrawal) {
            Withdrawal.Amount = Math.abs(Withdrawal.Amount);
            this.editedWithdrawal = Withdrawal;
            console.log(this.editedWithdrawal);

            axios.get(baseURL + 'api/Withdrawals/getRecurringWithdrawals/' + ForecastController.selectedItemID, Withdrawal).then(function (response) {
                try {
                    this.recurringWithdrawals = response.data;
                    this.columns = Object.keys(response.data[0]);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#WithdrawalMultipleEditModal").submit(function (event) {
                event.preventDefault();
            });
        },
        "MultipleEditselectedItem": function MultipleEditselectedItem() {
            axios.post(baseURL + 'api/Withdrawals/multipleEdits/' + ForecastController.selectedItemID, this.editedWithdrawal, this.recurringWithdrawals).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error.response.data.InnerException.ExceptionMessage);
            });
        },
        "RemoveItem": function RemoveItem(Withdrawal) {
            index = this.recurringWithdrawals.findIndex(x => x.id === Withdrawal.id);
            this.recurringWithdrawals.splice(index, 1);
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
        }
    },
    mounted: function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('multipleEdit-validation');
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
                        MultipleEditModalController.MultipleEditselectedItem();
                        $('#WithdrawalMultipleEditModal').modal('hide');
                        form.classList.remove('was-validated');
                    }
                }, false);
            });
        }, false);


    }
});


var DeleteModalWithdrawalController = new Vue({
    el: "#WithdrawalDeletionConfirmation",
    methods: {
        "deleteWithdrawal": function deleteWithdrawal() {
            axios.post(baseURL + 'api/Withdrawals/deleteWithdrawal/' + ForecastController.selectedItemID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        }
    }
});

var MultipleDeleteWithdrawalModalController = new Vue({
    el: "#multipleWithdrawalDeletionConfirmation",
    data: {
        columns: {},
        recurringWithdrawals: {}
    },
    methods: {
        "openMultipleDeleteModal": function openMultipleDeleteModal(Withdrawal) {
            Withdrawal.Amount = Math.abs(Withdrawal.Amount);
            axios.get(baseURL + 'api/Withdrawals/getRecurringWithdrawals/' + ForecastController.selectedItemID, Withdrawal).then(function (response) {
                try {
                    this.recurringWithdrawals = response.data;
                    this.columns = Object.keys(response.data[0]);
                }
                catch (e) {
                    console.log(e);
                }
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            $("#multipleWithdrawalDeletionConfirmation").submit(function (event) {
                event.preventDefault();
            });
        },
        "deleteMultipleWithdrawals": function deleteMultipleWithdrawals() {
            axios.post(baseURL + 'api/Withdrawals/deleteMultipleWithdrawals/' + ForecastController.selectedItemID).then(function (response) {
                try {
                    ForecastController.alertSuccessMessage("Changes were successful");
                    ForecastController.refreshTable();
                }
                catch (error) {
                    ForecastController.refreshTable();
                    ForecastController.alertErrorMessage(error);
                    console.log(error);
                }
            }).catch(function (error) {
                ForecastController.refreshTable();
                ForecastController.alertErrorMessage(error.response.data);
                console.log(error);
            });
        },
        "RemoveItem": function RemoveItem(Withdrawal) {
            index = this.recurringWithdrawals.findIndex(x => x.id === Withdrawal.id);
            this.recurringWithdrawals.splice(index, 1);
        },
        "resetForm": function resetForm() {
            ForecastController.refreshTable();
        }
    }
});

const dateHandler = function (selectedDateID) {
    //Next Two Weeks
    if (selectedDateID === 1) {
        today = new Date();
        var StartDate = new Date(today.toDateString());

        today = new Date();
        var EndDate = new Date(today.addDays(14));

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //This Month
    else if (selectedDateID === 2) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next Month
    else if (selectedDateID === 3) {
        today = new Date();
        //today = new Date(today.getFullYear(), today.getMonth()+ 1, 1);
        var StartDate = new Date(today.toDateString());

       // today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 3 Months
    else if (selectedDateID === 4) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    //Next 6 Months
    else if (selectedDateID === 5) {
        today = new Date();
        //today.setDate(today.getDate() - 6);
        var StartDate = new Date(today.toDateString());

        //today = new Date();
        var EndDate = new Date(today.getFullYear(), today.getMonth() + 7, 0);

        ForecastController.startDate = new Date().toISOString().slice(0, 10);
        ForecastController.endDate = EndDate.toISOString().slice(0, 10);
    }

    ForecastController.refreshTable();
};

serverBus.$on('dateSelected', dateHandler);