var frontend = frontend ?? {};
frontend.popupLoader = function () {
    const path = "resources/phone/frontend/js/phone/popup/";

    const scriptsToLoad = [
        'popupUpload.js', 
        'popupHelp.js', 
        'popupActivity.js', 
        'popupBug.js', 
        'popupPhonebook_NP.js', 
        'popupPhonebook_NPLL.js', 
        'popupPhonebook.js', 
        'popupPhonebookOverview.js', 
        'popupSettings.js'
    ];

    function createScriptElement(url) {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true; 
        return script;
    }

    function loadScripts() {
        const fragment = document.createDocumentFragment();
        for (const script of scriptsToLoad) {
            const scriptElement = createScriptElement(path + script);
            fragment.appendChild(scriptElement);
        }
        document.head.appendChild(fragment);
    }

    return {
        loadScripts: loadScripts
    };
}();


document.addEventListener('DOMContentLoaded', function () {
    frontend.popupLoader.loadScripts();
});
