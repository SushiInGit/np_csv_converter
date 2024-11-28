(function (loader) {

    // Trigger if no error popup
    document.addEventListener("DOMContentLoaded", function (e) {
        deactivateLoader()

    });

    window.addEventListener('load', function (e) {
        activateLoader();

    });

    window.addEventListener('finishload', function (e) {
        deactivateLoader();
    });

    // Effect
    function activateLoader() {
        document.querySelector('body').style.cursor = 'wait';
        loader.className = ('loader active');
    }

    function deactivateLoader() {
        document.querySelector('body').style.cursor = 'default';
        
        setTimeout(function () {
            document.querySelector('body').style.cursor = 'default';
        }, 10);

        setTimeout(function () {
            deactivate();
        }, 1000);

        function deactivate() {
            loader.className = ('loader inactive');
            loader.addEventListener('transitionend', function () {
                loader.className = ('loader inactive');
            }, false);
        }
    }

})(document.querySelector('.loader'));

