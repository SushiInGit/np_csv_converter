var frontend = frontend ?? {};

frontend.popupBug = (function () {
    function bugEvent() {

        const popupDivName = "bug";
        const content = `
            <form id="issueForm">
            <div class="reportDiv">
                <label>Report Type <span style="color: #ff4d4d;">*</span> <br><span class="disclaimer">(Maximum 2 selected)</span></label>
                <div class="tag-container" id="tagContainer">
                <!-- Type -->
                <div class="tag" data-value="👾 #Bug">👾 #Bug</div>
                <div class="tag" data-value="🚀 #Feature Request">🚀 #Feature Request</div>
                <div class="tag" data-value="🎨 #UI/UX">🎨 #UI/UX</div>
                <div class="tag" data-value="🔧 #Function">🔧 #Function</div>
                </div>
            </div>
            <div class="reportDiv">
                <label for="topic">Titel <span style="color: #ff4d4d;">*</span></label>
                <input type="text" id="topic" name="topic" required class="input-field" autocomplete="off" autocorrect="off" spellcheck="false">
            </div>
            <div class="reportDiv">
                <label for="description">Description <span style="color: #ff4d4d;">*</span></label>
                <textarea id="description" name="description" required class="input-field" autocorrect="on" spellcheck="true"></textarea>
            </div>
            <div class="reportDiv">
                <label for="screenshot">Show the Problem (Screenshot/Clip URL) </label>
                <input type="url" id="screenshot" name="screenshot" placeholder="Optional: Link to [clips.twitch.tv] or [kappa.lol] etc..." class="input-field">
            </div>
            <div class="reportDiv">
                <label for="discordUser">Discord Username <br><span class="disclaimer" style="color: #338cffe0; ">(in case we have questions about your report)</span></label>
                <input type="text" id="discordUser" name="discordUser" placeholder="Optional: Username" class="input-field">
            </div>
            <div class="disclaimer">Fields marked with <span style="color: #ff4d4d;">*</span> are required.</div>
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            <div class="button"><button type="submit">Send</button></div>
        `;
        const footer = ``;

        middleman.popupModel.createPopup(popupDivName, 'Report', content, footer);
        setTimeout(() => {global.bugHelper.send("phone");}, 50);
    }

    return {
        render: bugEvent,

    };


})();
