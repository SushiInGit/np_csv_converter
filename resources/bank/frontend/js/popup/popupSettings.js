var frontend = frontend ?? {};

frontend.popupSettings = (function () {
    /**
    * Render HTML-Element for settings and select user-settings
    **/
    function settingsEvent() {
        const popupDivName = "settings";
        const content = `
            <div class="settingsScroll">
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
                <div id="priceRangeDiv">
                    <label>Price Range Filter:</label>
                    <div class="price-range-container">
                        <input type="number" id="minPrice" placeholder="Min" min="0" max="500000000" step="1" />
                        <div class="slider-container">
                            <input type="range" id="minRangeSlider" min="0" max="100" step="1" value="0" />
                            <input type="range" id="maxRangeSlider" min="0" max="100" step="1" value="100" />
                            <div id="rangeTrack"></div>
                            <div id="rangeProgress"></div>
                        </div>
                        <input type="number" id="maxPrice" placeholder="Max" min="0" max="500000000" step="1" />
                    </div>
                    <div class="range-display">
                        <span id="rangeDisplay">$0 - Unlimited</span>
                    </div>
                </div>
                <div id="filterWords">
                    <label>Hide Records Containing:</label>
                    <div class="filter-tag-container">
                        <span class="filter-tag" data-value="Stock Sold">Stock Sold</span>
                        <span class="filter-tag" data-value="Type: Tax">Type: Tax</span>
                        <span class="filter-tag" data-value="Job:">Job:</span>
                        <span class="filter-tag" data-value="Store Purchase">Store Purchase</span>
                        <span class="filter-tag" data-value="Clothing Store">Clothing Store</span>
                        <span class="filter-tag" data-value="Parking spot purchase">Parking spot purchase</span>
                        <span class="filter-tag" data-value="Gas">Gas</span>
                        <span class="filter-tag" data-value="Payment: Fuel purchase">Payment: Fuel purchase</span>
                        <span class="filter-tag" data-value="Reimbursement: Fuel purchase">Reimbursement: Fuel purchase</span>
                        <span class="filter-tag" data-value="Impound Release Fee">Impound Release Fee</span>
                        <span class="filter-tag" data-value="Rental - Damage Fee">Rental - Damage Fee</span>
                        <span class="filter-tag" data-value="Rental Purchase">Rental Purchase</span>
                        <span class="filter-tag" data-value="Asset Bill Payment:">Asset Bill Payment:</span>
                        <span class="filter-tag" data-value="Property Bid:">Property Bid:</span>
                        <span class="filter-tag" data-value="Property Bid Withdrawal:">Property Bid Withdrawal:</span>
                        <span class="filter-tag" data-value="Scraps Production Fee">Scraps Production Fee</span>
                        <span class="filter-tag" data-value="Showroom Purchase">Showroom Purchase</span>
                        <span class="filter-tag" data-value="Showroom Sale">Showroom Sale</span>
                        <span class="filter-tag" data-value="Physical payslip cashout">Physical payslip cashout</span>
                        <span class="filter-tag" data-value="Blaine County Paycheck">Blaine County Paycheck</span>
                        <span class="filter-tag" data-value="Los Santos Paycheck">Los Santos Paycheck</span>
                        <span class="filter-tag" data-value="Financial Administrative Costs">Financial Administrative Costs</span>
                    </div>
                </div>
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

                    // Initialize price range slider
                    const minPriceInput = document.getElementById('minPrice');
                    const maxPriceInput = document.getElementById('maxPrice');
                    const minRangeSlider = document.getElementById('minRangeSlider');
                    const maxRangeSlider = document.getElementById('maxRangeSlider');
                    const rangeProgress = document.getElementById('rangeProgress');
                    const rangeDisplay = document.getElementById('rangeDisplay');

                    // Exponential scale configuration
                    const MAX_PRICE = 500000000; // $500,000,000
                    const MIN_PRICE = 0;
                    
                    // Convert slider position (0-100) to exponential price value
                    function sliderToPrice(sliderValue) {
                        if (sliderValue === 0) return MIN_PRICE;
                        if (sliderValue === 100) return MAX_PRICE;
                        
                        // Use exponential scale to reach 500M at position 100
                        // This gives us a smooth exponential curve from 0 to 500M
                        const exp = sliderValue * 8.7 / 100; // log10(500M+1) ≈ 8.7
                        const price = Math.pow(10, exp) - 1;
                        return Math.round(Math.min(price, MAX_PRICE));
                    }
                    
                    // Convert price to slider position (0-100)
                    function priceToSlider(price) {
                        if (price <= MIN_PRICE) return 0;
                        if (price >= MAX_PRICE) return 100;
                        
                        // Inverse of the above formula
                        const sliderValue = Math.log10(price + 1) * 100 / 8.7;
                        return Math.round(sliderValue);
                    }

                    // Set slider range to 0-100 for percentage-based control
                    minRangeSlider.min = 0;
                    minRangeSlider.max = 100;
                    maxRangeSlider.min = 0;
                    maxRangeSlider.max = 100;

                    // Set initial values from settings if available
                    const minVal = parseInt(getsettings.minPriceFilter) || 0;
                    let maxVal = parseInt(getsettings.maxPriceFilter);
                    
                    // Set input values
                    minPriceInput.value = minVal;
                    
                    // Handle unlimited (-1) or undefined
                    if (maxVal === -1 || isNaN(maxVal)) {
                        maxPriceInput.value = '';
                        maxPriceInput.placeholder = 'Unlimited';
                        maxRangeSlider.value = 100;  // Set slider to max position
                    } else {
                        maxPriceInput.value = maxVal;
                        maxPriceInput.placeholder = 'Max';
                        maxRangeSlider.value = priceToSlider(maxVal);
                    }
                    
                    minRangeSlider.value = priceToSlider(minVal);

                    // Update progress bar and display
                    function updateRangeVisuals() {
                        const minSliderVal = parseInt(minRangeSlider.value);
                        const maxSliderVal = parseInt(maxRangeSlider.value);
                        
                        // Get actual values from input fields for accurate display
                        const minPrice = parseInt(minPriceInput.value) || 0;
                        const maxPrice = parseInt(maxPriceInput.value) || sliderToPrice(maxSliderVal);
                        
                        rangeProgress.style.left = minSliderVal + '%';
                        rangeProgress.style.width = (maxSliderVal - minSliderVal) + '%';
                        
                        // Show "Unlimited" when max slider is at 100% and input is empty
                        const isUnlimited = maxSliderVal >= 100 && !maxPriceInput.value;
                        const maxDisplay = isUnlimited ? 'Unlimited' : `$${maxPrice.toLocaleString()}`;
                        rangeDisplay.textContent = `$${minPrice.toLocaleString()} - ${maxDisplay}`;
                        
                        // Update max input field to show "Unlimited" text
                        if (isUnlimited) {
                            maxPriceInput.placeholder = 'Unlimited';
                        } else {
                            maxPriceInput.placeholder = 'Max';
                        }
                    }

                    // Sync slider with input fields
                    function syncSliderToInputs() {
                        let min = parseInt(minPriceInput.value) || 0;
                        let max = parseInt(maxPriceInput.value) || MAX_PRICE;
                        
                        // Clamp values
                        min = Math.max(MIN_PRICE, Math.min(min, MAX_PRICE));
                        max = Math.max(MIN_PRICE, Math.min(max, MAX_PRICE));
                        
                        // Ensure min doesn't exceed max
                        if (min > max) {
                            min = max;
                            minPriceInput.value = min;
                        }
                        
                        minRangeSlider.value = priceToSlider(min);
                        maxRangeSlider.value = priceToSlider(max);
                        updateRangeVisuals();
                    }

                    // Sync input fields with slider
                    function syncInputsToSlider(isMin) {
                        let minSliderVal = parseInt(minRangeSlider.value);
                        let maxSliderVal = parseInt(maxRangeSlider.value);
                        
                        // Ensure min doesn't exceed max
                        if (isMin && minSliderVal > maxSliderVal) {
                            minSliderVal = maxSliderVal;
                            minRangeSlider.value = minSliderVal;
                        } else if (!isMin && maxSliderVal < minSliderVal) {
                            maxSliderVal = minSliderVal;
                            maxRangeSlider.value = maxSliderVal;
                        }
                        
                        const minPrice = sliderToPrice(minSliderVal);
                        const maxPrice = sliderToPrice(maxSliderVal);
                        
                        minPriceInput.value = minPrice;
                        // Handle unlimited case
                        if (maxSliderVal >= 100) {
                            maxPriceInput.value = '';
                        } else {
                            maxPriceInput.value = maxPrice;
                        }
                        updateRangeVisuals();
                    }

                    // Event listeners for input fields
                    minPriceInput.addEventListener('input', syncSliderToInputs);
                    maxPriceInput.addEventListener('input', syncSliderToInputs);

                    // Event listeners for sliders
                    minRangeSlider.addEventListener('input', () => syncInputsToSlider(true));
                    maxRangeSlider.addEventListener('input', () => syncInputsToSlider(false));
                    
                    // Initial visual update
                    updateRangeVisuals();

                    // Initialize filter words UI
                    initializeFilterWords(getsettings.filterWords || []);

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
            window.dispatchEvent(new Event('finishload'));
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
        const selectedFilterWords = getSelectedFilterWords();
        
        const newSettingsData = {
            chunkSize: chunkSize.value,
            timeZone: timezone.value,
            dateFormat: dateformat.value,
            timeFormat: use12hClock.value,
            displayOrder: timeFirst.value,
            offsetBySettings: offsetBySettings.value,
            minPriceFilter: parseInt(document.getElementById('minPrice').value) || 0,
            maxPriceFilter: parseInt(document.getElementById('maxPrice').value) || (document.getElementById('maxPrice').placeholder === 'Unlimited' ? -1 : 500000000),
            filterWords: selectedFilterWords
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
        window.dispatchEvent(new Event('finishload'));
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
    * Initialize filter words UI with saved values
    **/
    function initializeFilterWords(savedWords) {
        // Pill/Tag Selection
        document.querySelectorAll('.filter-tag').forEach(tag => {
            const value = tag.getAttribute('data-value');
            
            if (savedWords.includes(value)) {
                tag.classList.add('selected');
            }
            
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });
    }

    /**
    * Get selected filter words
    **/
    function getSelectedFilterWords() {
        return Array.from(document.querySelectorAll('.filter-tag.selected'))
            .map(tag => tag.getAttribute('data-value'));
    }

    return {
        render: settingsEvent,
        active: lastActiveReload,
        save: saveSettingsTrigger,
        removeBank: removeOldBankRecords,
        load: () => { return loadSettingsTrigger() },
        reset: () => { return resetSettingsTrigger(middleman.settings.settings()) }
    };
})();


