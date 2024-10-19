var frontend = frontend ?? {};
frontend.popupLoader = function () {
    const path = "resources/frontend/js/phone/popup/";

    const scriptsToLoad = ['popupUpload.js', 'popupHelp.js', 'popupActivity.js', 'popupBug.js'];

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url; 
            script.onload = () => resolve(`Loaded: ${url}`);
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    }
    async function loadScriptsSequentially() {
        for (const script of scriptsToLoad) {
            try {
                await loadScript(path + script);
            } catch (error) {
                console.error(error);
            }
        }
    }
    return {
        loadScripts: loadScriptsSequentially
    };
}();

document.addEventListener('DOMContentLoaded', function() {
    frontend.popupLoader.loadScripts();
});
