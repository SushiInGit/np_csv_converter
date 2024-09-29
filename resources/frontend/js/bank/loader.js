(function (loader) {


        // Trigger if no error popup
        document.addEventListener("DOMContentLoaded", function (e) {
            deactivateLoader()
        });

        window.addEventListener('beforeunload', function (e) {
            activateLoader();
        });

        window.addEventListener('load', function (e) {
            deactivateLoader();
        });

    

    
    // Effect
    function activateLoader() {
        loader.className = ('loader active');
    }

    function deactivateLoader() {
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

/////////////////////////////////////////////

