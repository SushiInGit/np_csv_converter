var frontend = frontend ?? {};
frontend.popupLoader = function () {
    const path = "resources/frontend/js/bank/popup/";

    const scriptsToLoad = [
        'popupUpload.js', 
        'popupHelp.js',  
        'popupBug.js', 
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

