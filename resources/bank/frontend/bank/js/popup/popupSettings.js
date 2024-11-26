var frontend = frontend ?? {};

frontend.popupSettings = (function () {
    /**
    * Render HTML-Element for settings and select user-settings
    **/
    function settingsEvent() {
        const popupDivName = "settings";
        const content = `
            <div id="chunkSizeDiv">
                <label for="chunkSize">Display Transfers Amount:</label>
                <select id="chunkSize">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                    <option value="200">200</option>
                    <option value="250">250</option>
                    <option value="300">300</option>                    
                </select>
            </div>
            <div id="timezoneDiv">
                <label for="timezone">Timezone:</label>
                <select id="timezone">
                    <option value="utc">Coordinated Universal Time (UTC)</option>
                    <option value="gmt">Greenwich Mean Time (GMT)</option>
                    <option value="est">Eastern Standard Time (EST)</option>
                    <option value="pt">Pacific Time (PT)</option>
                    <option value="ast">Arabia Standard Time (AST)</option>
                    <option value="jst">Japan Standard Time (JST)</option>
                    <option value="cst">China Standart Time (CST)</option>
                    <option value="ist">Indian Standard Time (IST)</option>
                    <option value="pst">America/Los_Angeles (PST/PDT)</option>
                    <option value="edt">America/New_York (EDT)</option>
                    <option value="aest">Australia/Sydney (AEST/AEDT)</option>
                    <option value="cest">Europe/Berlin (CEST)</option>
                    <option value="bst">Europe/London (BST)</option>
                </select>
            </div>
            <div id="dateformatDiv">
                <label for="dateformat">Dateformat:</label>
                <select id="dateformat">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
                    <option value="DD MMMM YYYY">DD MMMM YYYY</option>
                </select>
            </div>
            <div id="use12hClockDiv">
                <label for="use12hClock">12h or 24h clock:</label>
                <select id="use12hClock">
                    <option value="12Hour">12Hour</option>
                    <option value="24Hour">24Hour</option>
                </select>
            </div>
            <div id="timeFirstDiv">
                <label for="timeFirst">Date/Time order</label>
                <select id="timeFirst">
                    <option value="dateAndTime">${(global.timeConverter.loadSettings().dateFormat)} (Date) HH:MM (Time)</option>
                    <option value="timeAndDate">HH:MM (Time) ${(global.timeConverter.loadSettings().dateFormat)} (Date)</option>
                </select>
            </div>  
            <div id="dlsDiv">
                <label for="dlsset">Daylight Savings: <!-- (${global.timeConverter.processTimestamp(Date.now()).isDaylightSavingTime ? "Summer Time " : "Winter Time"}) --></label>
                <select id="dlsset">
                    <option value="0">Dynamic Time Offset</option>
                    <option value="-1">Force Winter Time (-1h)</option>
                    <option value="+1">Force Summer Time (+1h)</option>
                </select>
            </div>
            <div id="offsetDiv"  style="display: none">
                <label for="showoffset">Force use Time Offset (${global.timeConverter.processTimestamp(Date.now()).offsettimeZoneHours}):</label>
                <select id="showoffset">
                    <option value="on">Yes</option>
                    <option value="off">No</option>
                </select>
            </div>  

        `;
        const footer = `<button class="ok" onclick="frontend.popupSettings.save(); ">Save</button> <button class="risk" onclick="frontend.popupSettings.reset(); frontend.popupSettings.removeBank();">Reset</button>`;

        frontend.renderModel.createPopup(popupDivName, 'Settings', content, footer);
        
        setTimeout(() => {
            const chunkSize = document.getElementById('chunkSize').value;
            const timezone = document.getElementById('timezone').value;
            const dateformat = (document.getElementById('dateformat').value);
            const use12hClock = document.getElementById('use12hClock').value;
            const showoffset = document.getElementById('showoffset').value;
            const timeFirst = document.getElementById('timeFirst').value;
            const showDLS = document.getElementById('dlsset').value;
            
            setSettingSelectedValue('chunkSize',    `${ (frontend.popupSettings.load().chunkSize) }`);
            setSettingSelectedValue('timezone',     `${ (frontend.popupSettings.load().timeZone) }`);
            setSettingSelectedValue('dateformat',   `${ (frontend.popupSettings.load().dateFormat) }`);
            setSettingSelectedValue('use12hClock',  `${ (frontend.popupSettings.load().timeFormat) }`);
            setSettingSelectedValue('showoffset',   `${ (frontend.popupSettings.load().offsetShow) }`);
            setSettingSelectedValue('timeFirst',    `${ (frontend.popupSettings.load().displayOrder) }`);
            setSettingSelectedValue('dlsset',       `${ (frontend.popupSettings.load().offsetBySettings) }`);
        }, 50);
    }

    const defaultSettings = {
        chunkSize: '50',
        timeZone: 'utc',
        timeFormat: '24Hour',
        offsetShow: 'on',
        dateFormat: 'YYYY-MM-DD',
        displayOrder: 'dateAndTime',
        offsetBySettings: '0',
    };

    /**
    * Reopen last active Transfer
    * To load new Settings
    * @returns 
    **/
    function lastActiveReload() {
        try {
            const activeUser = document.querySelector('.user.active');

            if (!activeUser) {
                throw new Error('No active transaction found.');
            }
            const classList = activeUser.classList;
            const idDigits = [...classList].find(cls => cls.startsWith('id__')).replace('id__', '');
            var table = document.querySelector("#bankRecordsTable");

            if (classList[1] === "all") {
                table.innerHTML = ``;
                const reorderData = frontend.renderViews.reorderObject(middleman.bankData.get().records);

                const dataGrp = frontend.renderTable(reorderData);
                frontend.renderTable(dataGrp).then((table) => {
                }).catch((error) => {
                    console.error("Error:", error);
                });

            } else {
                table.innerHTML = ``;
                const reorderData = frontend.renderViews.reorderObject(middleman.bankData.getGrouped()[idDigits].records);

                const dataGrp = frontend.renderTable(reorderData);
                frontend.renderTable(dataGrp).then((table) => {
                }).catch((error) => {
                    console.error("Error:", error);
                });
            }

        } catch (error) {
            return;
        }
    }

    /**
    * Reset to default settings
    **/
    function resetSettingsTrigger(defaultSettings) {
        const npSettings = localStorage.getItem("settings");
        if (npSettings) {
            const settingsObj = JSON.parse(npSettings);
            // Remove the specified keys
            delete settingsObj.MAX_STORAGE_MB;         

            settingsObj.chunkSize = defaultSettings.chunkSize;
            settingsObj.timeZone = defaultSettings.timeZone;
            settingsObj.dateFormat = defaultSettings.dateFormat;
            settingsObj.timeFormat = defaultSettings.timeFormat;
            settingsObj.offsetShow = defaultSettings.offsetShow;
            settingsObj.displayOrder = defaultSettings.displayOrder;
            settingsObj.offsetBySettings = defaultSettings.offsetBySettings;
            
            setSettingSelectedValue('chunkSize', `${(defaultSettings.chunkSize)}`);
            setSettingSelectedValue('timezone', `${(defaultSettings.timeZone)}`);
            setSettingSelectedValue('dateformat', `${(defaultSettings.dateFormat)}`);
            setSettingSelectedValue('use12hClock', `${(defaultSettings.timeFormat)}`);
            setSettingSelectedValue('showoffset', `${(defaultSettings.offsetShow)}`);
            setSettingSelectedValue('timeFirst', `${(defaultSettings.displayOrder)}`);
            setSettingSelectedValue('dlsset', `${(defaultSettings.offsetBySettings)}`);

            localStorage.setItem("settings", JSON.stringify(settingsObj));
            console.log("localStorage.settings has been set to default.");
            global.alertsystem('success', `Settings reset successfully.`, 4);

        } else {
            console.log("localStorage.settings does not exist.");
        }
    }

    /**
    * Removes unused Bank-Records from Localstorage
    **/
    function removeOldBankRecords() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.endsWith("bankRecords")) {
                console.log(`Removed old Bank Record: '${key}'`)
                localStorage.removeItem(key);
                i--;
            }
        }
    }

    /**
    * Saves Settings
    **/
    function saveSettingsTrigger() {
        const newSettingsData = {
            chunkSize: chunkSize.value,
            timeZone: timezone.value,
            dateFormat: dateformat.value,
            timeFormat: use12hClock.value,
            offsetShow: showoffset.value,
            displayOrder: timeFirst.value,
            offsetBySettings: dlsset.value
        };

        /* UMAMI */
        try {
            global.helperUserinfo.trackSettingsTimezone(frontend.popupSettings.load().timeZone, timezone.value);
            global.helperUserinfo.trackSettingsDLS(frontend.popupSettings.load().offsetBySettings, dlsset.value);
        } catch (error) {
            console.error("An error occurred while tracking changes:", error.message);
        }

        frontend.renderModel.closePopupDiv();
        global.timeConverter.saveSettings(newSettingsData);
        frontend.renderBank.renderMetadata(localStorage.getItem('lastBankDB'));
        frontend.renderBank.reopenActiveTransfer();
        global.alertsystem('success', `Settings saved successfully.`, 4);
        frontend.popupSettings.active();
    }

    /**
    * Load Settings or swap to defaultSettings
    * @returns Loaded Settings
    **/
    function loadSettingsTrigger(defaultSettings) {
        const SETTINGS_KEY = 'settings';
        const savedPreferences = localStorage.getItem(SETTINGS_KEY);
        return savedPreferences ? JSON.parse(savedPreferences) : defaultSettings;
    }
    /**
    * Get settings.value based of HTML-Element
    * @param {*} selectId 
    * @param {*} value 
    **/
    function setSettingSelectedValue(selectId, value) {
        const selectElement = document.getElementById(selectId);
        selectElement.value = value;
    }

    return {
        render: settingsEvent,
        active: lastActiveReload,
        save: saveSettingsTrigger,
        removeBank: removeOldBankRecords,
        load: () => { return loadSettingsTrigger(defaultSettings) },
        reset: () => { return resetSettingsTrigger(defaultSettings) }
    };
})();


