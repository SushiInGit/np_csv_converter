var frontend = frontend ?? {};

frontend.popupSettings = (function () {
    function settingsEvent() {
        const popupDivName = "settings";
        const content = `
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
            <div id="dlsDiv">
                <label for="dlsset">Daylight Savings: <!-- (${processTimestamp(Date.now()).isDaylightSavingTime ? "Summer Time " : "Winter Time"}) --></label>
                <select id="dlsset">
                    <option value="0">Dynamic Time Offset</option>
                    <option value="-1">Force Winter Time (-1h)</option>
                    <option value="1">Force Summer Time (+1h)</option>
                </select>
            </div>
            <div id="offsetDiv"  style="display: none">
                <label for="showoffset">Force use Time Offset (${processTimestamp(Date.now()).offsettimeZoneHours}):</label>
                <select id="showoffset">
                    <option value="on">Yes</option>
                    <option value="off">No</option>
                </select>
            </div>  
            <div id="timeFirstDiv"  style="display: none">
                <label for="timeFirst">Date/Time order</label>
                <select id="timeFirst">
                    <option value="dateAndTime">Date then Time</option>
                    <option value="timeAndDate">Time then Date</option>
                </select>
            </div>  
        `;
        const footer = `<button class="ok" onclick="frontend.popupSettings.save(); frontend.popupSettings.removeBank();">Save</button> <button class="risk" onclick="frontend.popupSettings.reset(); frontend.popupSettings.removeBank();">Reset</button>`;

        middleman.popupModel.createPopup(popupDivName, 'Settings', content, footer);
        
        setTimeout(() => {
            const timezone = document.getElementById('timezone').value;
            const dateformat = (document.getElementById('dateformat').value);
            const use12hClock = document.getElementById('use12hClock').value;
            const showoffset = document.getElementById('showoffset').value;
            const timeFirst = document.getElementById('timeFirst').value;
            const showDLS = document.getElementById('dlsset').value;
           
            setSettingSelectedValue('timezone', `${(loadSettings().timeZone)}`);
            setSettingSelectedValue('dateformat', `${(loadSettings().dateFormat)}`);
            setSettingSelectedValue('use12hClock', `${(loadSettings().timeFormat)}`);
            setSettingSelectedValue('showoffset', `${(loadSettings().offsetShow)}`);
            setSettingSelectedValue('timeFirst', `${(loadSettings().displayOrder)}`);
            setSettingSelectedValue('dlsset', `${(loadSettings().offsetBySettings)}`);
            
        }, 50);
    }

    function lastActiveReload() {
        try {
            const activeUser = document.querySelector('.user.active');
            if (!activeUser) {
                throw new Error('No active comunication found.');
            }
            const classList = activeUser.classList;
            const idDigits = [...classList].find(cls => cls.startsWith('id__')).replace('id__', '');

            const groupCommOutput = middleman.requestData.allMetadata();
            const matchingData = groupCommOutput.filter(entry => entry.groupIndex === parseInt(idDigits));

            if (matchingData.length > 0) {
                frontend.renderChat(matchingData[0]);
            } else {
                return;
            }

        } catch (error) {
            return;
        }
    }

    function removeSettingsTrigger() {
        const npSettings = localStorage.getItem("np_settings");
        if (npSettings) {
            const settingsObj = JSON.parse(npSettings);
            const defaultSettings = {
                timeZone: 'utc',
                timeFormat: '24Hour',
                offsetShow: 'on',
                dateFormat: 'YYYY-MM-DD',
                displayOrder: 'dateAndTime',
                offsetBySettings: '0'
        
            };
            // Remove the specified keys
            delete settingsObj.MAX_STORAGE_MB;         

            settingsObj.timeZone = defaultSettings.timeZone;
            settingsObj.dateFormat = defaultSettings.dateFormat;
            settingsObj.timeFormat = defaultSettings.timeFormat;
            settingsObj.offsetShow = defaultSettings.offsetShow;
            settingsObj.displayOrder = defaultSettings.displayOrder;
            settingsObj.offsetBySettings = defaultSettings.offsetBySettings;
            
            setSettingSelectedValue('timezone', `${(defaultSettings.timeZone)}`);
            setSettingSelectedValue('dateformat', `${(defaultSettings.dateFormat)}`);
            setSettingSelectedValue('use12hClock', `${(defaultSettings.timeFormat)}`);
            setSettingSelectedValue('showoffset', `${(defaultSettings.offsetShow)}`);
            setSettingSelectedValue('timeFirst', `${(defaultSettings.displayOrder)}`);
            setSettingSelectedValue('dlsset', `${(defaultSettings.offsetBySettings)}`);

            localStorage.setItem("np_settings", JSON.stringify(settingsObj));
            console.log("localStorage.np_settings has been removed.");
            global.alertsystem('success', `Settings reset successfully.`, 4);

        } else {
            console.log("localStorage.np_settings does not exist.");
        }
    }

    function saveSettingsTrigger() {
        const newSettingsData = {
            timeZone: timezone.value,
            dateFormat: dateformat.value,
            timeFormat: use12hClock.value,
            offsetShow: showoffset.value,
            displayOrder: timeFirst.value,
            offsetBySettings: dlsset.value
        };
        
        try {
            middleman.umami.trackSettingsTimezone(loadSettings().timeZone, timezone.value);
            middleman.umami.trackSettingsDLS(loadSettings().offsetBySettings, dlsset.value);
        } catch (error) {
            console.error("An error occurred while tracking settings changes:", error.message);
        }
        
        middleman.popupModel.closePopupDiv();
        saveSettings(newSettingsData);
        global.alertsystem('success', `Settings saved successfully.`, 4);
        //global.alertsystem('info', `To see the changes, please reload the page or reopen the last transaction. Sorry for the inconvenience, this issue will hopefully be fixed by the devs soon.`, 15);
        frontend.popupSettings.active();
    }

    function setSettingSelectedValue(selectId, value) {
        const selectElement = document.getElementById(selectId);
        selectElement.value = value;
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
    function checkSettings() {
        const settings = JSON.parse(localStorage.getItem('np_settings'));

        if (settings && (
            //!settings.chunkSize  || settings.chunkSize === '' || 
            !settings.dateFormat || settings.dateFormat === '' || 
            !settings.displayOrder || settings.displayOrder === '' || 
            !settings.offsetBySettings || settings.offsetBySettings === '' || 
            !settings.offsetBySettings === 'auto' || !settings.offsetBySettings === 'false' || !settings.offsetBySettings === 'true' ||
            !settings.offsetShow || settings.offsetShow === '' || 
            !settings.timeFormat || settings.timeFormat === '' || 
            !settings.timeZone || settings.timeZone === ''
        )) {
            global.alertsystem('error', `Your settings seem to be corrupted or something went wrong. <br>Please reset or change them.`, 14);
            console.error('Error: Settings are missing or currpted in localStorage');
        }
    }
    return {
        render: settingsEvent,
        active: lastActiveReload,
        save: saveSettingsTrigger,
        reset: removeSettingsTrigger,
        removeBank: removeOldBankRecords,
        check: checkSettings
    };
})();

frontend.popupSettings.check();