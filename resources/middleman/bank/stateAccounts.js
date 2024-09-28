
var middleman = middleman ?? {};

middleman.stateAccounts = function (input, accountName) {
    if (input <= 100) {
        let data;
        if (input === 2) {
            data = "Mayor Account";
        }
        else if (input === 3) {
            data = "DOJ Account";
        }
        else if (input === 4) {
            data = "State Account";
        }
        else if (input === 6) {
            data = "LSPD Account";
        }
        else if (input === 10) {
            data = "LS Authority Account";
        }
        else if (input === 11) {
            data = "BC Authority Account";
        }
        else if (input === 12) {
            data = "BCSO Account";
        } else {
            data = "State Account";
        }
        return data;
    }
    if (input >= 1000) {
        return accountName
    }
};