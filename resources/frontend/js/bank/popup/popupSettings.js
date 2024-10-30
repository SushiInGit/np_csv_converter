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
                    <option value="auto">Dynamic Time Offset</option>
                    <option value="false">Force Winter Time (-1h)</option>
                    <option value="true">Force Summer Time (+1h)</option>
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
        const footer = `<button class="ok" onclick="frontend.popupSettings.save()">Save</button>`;

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
            setSettingSelectedValue('dlsset', `${(loadSettings().isDaylightSavingTime)}`);
        }, 50);
    }

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

    function saveSettingsTrigger() {
        const newSettingsData = {
            timeZone: timezone.value,
            dateFormat: dateformat.value,
            timeFormat: use12hClock.value,
            offsetShow: showoffset.value,
            displayOrder: timeFirst.value,
            isDaylightSavingTime: dlsset.value
        };

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

    return {
        render: settingsEvent,
        active: lastActiveReload,
        save: saveSettingsTrigger
    };
})();


