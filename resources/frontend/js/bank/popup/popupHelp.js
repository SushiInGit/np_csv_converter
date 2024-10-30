var frontend = frontend ?? {};

frontend.popupHelp = (function () {
    function helpEvent() {
        showHelp();
        const popupDivName = "help";
        const file = `bankHelp.md`;
        middleman.popupHelp.createPopup(popupDivName, 'Help & Information', file);
    }

    function showHelp() {
        const popup = document.getElementById('help');
        popup.classList = "noselect show help";
      }

    return {
        render: helpEvent
    };
})();
