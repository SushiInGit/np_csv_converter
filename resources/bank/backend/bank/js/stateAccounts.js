
var backend = backend ?? {};

/**
* Fixes "null" civ_name / account_name based on Server
* Options: server('whitelist', 'blue', 'green')
**/
backend.stateAccounts = (function () {
    let npserver = localStorage.getItem('npserver');
    let maxStatAccountID = 100;
    let minUserAccountID = 1000;
    
    /**
    * Set AccountName to StateAccount
    * @param {*} input to_account_id / from_account_id
    * @param {*} accountName  to_account_name / from_account_name
    * @returns Fixed account_name ['State Account' or 'Original Account_Name']
    **/
    function AccountName(input, accountName) {
        return input <= maxStatAccountID ? "State Account" : accountName;
    };

    /**
    * Set AccountName to StateAccount
    * @param {*} input to_account_id / from_account_id
    * @param {*} accountName  to_civ_name / from_civ_name
    * @returns Fixed civ_name ['Forced Civ_Name based of Array' or 'Original Civ_Name']
    **/
    function CivName(input, accountName) {
        const whitelistAccountNames = {
            2: "Mayor Account",
            3: "DOJ Account",
            4: "State Account",
            6: "LSPD Account",
            10: "LS Authority Account",
            11: "BC Authority Account",
            12: "BCSO Account"
        };

        const blueAccountNames = {
            1: "State Account"
        };

        const greenAccountNames = {
            1: "State Account"
        };

        /**
        * Forced State-Account Names by Server 
        * @augments serverType 'whitelist', 'blue', 'green'
        **/
        const setCivAccountName = (serverType) => {
            if (serverType === 'whitelist' && input <= maxStatAccountID) {
                return whitelistAccountNames[input] || "State Account";
            }
            if (serverType === 'blue' && input <= maxStatAccountID) {
                return blueAccountNames[input] || "State Account";
            }
            if (serverType === 'green' && input <= maxStatAccountID) {
                return greenAccountNames[input] || "State Account";
            }
            if (input <= maxStatAccountID) {
                return "State Account";
            }
            if (input >= minUserAccountID) {
                return accountName;
            }
        };
        
        return setCivAccountName(npserver);
    }

    return {
        AccountName: (input, accountName) => { return AccountName(input, accountName) },
        CivName: (input, accountName) => { return CivName(input, accountName) }
    }
})();