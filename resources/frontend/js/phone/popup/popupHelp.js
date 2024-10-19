var frontend = frontend ?? {};

frontend.popupHelp = (function () {
    function helpEvent() {

        const popupDivName = "help";
        const content = `<div id="markdownContent"></div>`;
        const footer = ``;

        middleman.popupModel.createPopup(popupDivName, 'Help & Information', content, footer);
        setTimeout(() => { global.markdownReader('phone.md'); }, 50);
    }

    return {
        render: helpEvent
    };
})();
