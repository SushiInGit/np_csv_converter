document.addEventListener('DOMContentLoaded', function () {

    document.body.addEventListener('click', function (event) {
        const closestParent = event.target.closest('.date-marker, .message, .call');
        if (closestParent) {
            closestParent.classList.toggle('hide');
        }
    });

    if (typeof html2canvas === 'function') {
        document.getElementById('captureButton').addEventListener('click', function () {
            const button = document.querySelector('.buttons');
            const hide = document.querySelectorAll('.hide');

            button.style.display = 'none';

            hide.forEach(function (div) {
                div.style.display = 'none';
            });

            html2canvas(document.body).then(function (canvas) {
                const link = document.createElement('a');
                const imgData = canvas.toDataURL('image/png');
                link.href = imgData;
                /*
                link.download = 'np_converter.png';
                link.click();
                */

            const newTab = window.open();
            newTab.document.body.innerHTML = `<img src="${imgData}" alt="NP Converter Screenshot" style="max-width:100%;"/>`;

            }).catch(function (error) {
                console.error('Error capturing the page:', error);
            });

            button.style.display = 'flex';

            hide.forEach(function (div) {
                div.style.display = 'block';
            });
        });

    } else {
        console.log('html2canvas is not loaded.');
    }
});