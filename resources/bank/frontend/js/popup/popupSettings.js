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
                    <option value="50">50 (Default)</option>
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
                    <option value="dateAndTime">Date then Time</option>
                    <option value="timeAndDate">Time then Date</option>
                </select>
            </div>  
            <div id="offsetBySettingsDiv">
                <label for="offsetBySettings">Daylight Savings: <!-- (${middleman.timeConverter.processTimestamp(Date.now()).isDaylightSavingTime ? "Summer Time " : "Winter Time"}) --></label>
                <select id="offsetBySettings">
                    <option value="0">Dynamic Time Offset</option>
                    <option value="-1">Force Winter Time (-1h)</option>
                    <option value="+1">Force Summer Time (+1h)</option>
                </select>
            </div>
        `;
        const footer = `<button class="ok" onclick="frontend.popupSettings.save(); frontend.popupSettings.removeBank(); ">Save</button> <button class="risk" onclick="frontend.popupSettings.reset(); frontend.popupSettings.removeBank();">Reset</button>`;

        frontend.renderModel.createPopup(popupDivName, 'Settings', content, footer);

        
        setTimeout(() => {
            (async () => {
                try {
                    const settings = middleman.settings.getSettings();
                    const getsettings = settings; 

                    setSettingSelectedValue('chunkSize', `${(getsettings.chunkSize)}`);
                    setSettingSelectedValue('timezone', `${(getsettings.timeZone)}`);
                    setSettingSelectedValue('dateformat', `${(getsettings.dateFormat)}`);
                    setSettingSelectedValue('use12hClock', `${(getsettings.timeFormat)}`);
                    setSettingSelectedValue('timeFirst', `${(getsettings.displayOrder)}`);
                    setSettingSelectedValue('offsetBySettings', `${(getsettings.offsetBySettings)}`);

                } catch (error) {
                    console.error("Error retrieving settings:", error);
                }
            })();
        }, 50);
    }

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
        const npSettings = defaultSettings;
        if (npSettings) {
            middleman.settings.updateSettings(npSettings)
            frontend.popupSettings.render();
            window.dispatchEvent(new Event('unload'));
        } else {
            console.log("Settings-DB does not exist.");
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
            displayOrder: timeFirst.value,
            offsetBySettings: offsetBySettings.value
        };

        /* UMAMI */
        try {
            middleman.helperUserinfo.trackSettingsTimezone(frontend.popupSettings.load().timeZone, timezone.value);
            middleman.helperUserinfo.trackSettingsDLS(frontend.popupSettings.load().offsetBySettings, offsetBySettings.value);
        } catch (error) {
            console.error("An error occurred while tracking changes:", error.message);
        }
        middleman.settings.updateSettings(newSettingsData)
        frontend.renderBank.renderMetadata(localStorage.getItem('lastBankDB'));
        frontend.popupSettings.active();
        frontend.renderModel.closePopupDiv();
        frontend.renderBank.reopenActiveTransfer();
        window.dispatchEvent(new Event('unload'));
    }

    /**
    * Load Settings or swap to defaultSettings
    * @returns Loaded Settings
    **/
    function loadSettingsTrigger() {
        return  middleman.settings.getSettings();
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

    /**
    * Check if the settings are not corrupted or missing
    **/
    function checkSettings() {
        const settings = middleman.settings.settings();

        if (settings && (
            !settings.chunkSize || settings.chunkSize === '' ||
            !settings.dateFormat || settings.dateFormat === '' ||
            !settings.displayOrder || settings.displayOrder === '' ||
            !settings.offsetBySettings || settings.offsetBySettings === '' ||
            !settings.timeFormat || settings.timeFormat === '' ||
            !settings.timeZone || settings.timeZone === ''
        )) {
            middleman.alertsystem('error', `Your settings seem to be corrupted or something went wrong. <br>Please reset or change them.`, 14);
            console.error('Error: Settings are missing or currpted in indexedDB');
        }
    }
    return {
        render: settingsEvent,
        active: lastActiveReload,
        save: saveSettingsTrigger,
        removeBank: removeOldBankRecords,
        checkSettings: checkSettings,
        load: () => { return loadSettingsTrigger(middleman.settings.settings()) },
        reset: () => { return resetSettingsTrigger(middleman.settings.settings()) }
    };
})();


