document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
        const closestParent = event.target.closest('.date-marker, .message, .call');

        if (closestParent) {
            closestParent.classList.toggle('hide');
        }
    });

    if (typeof html2canvas === 'function') {
        document.getElementById('captureButton').addEventListener('click', function () {
            const exportBody = document.querySelector('.exportBody');
            const loadingMessage = document.querySelector('.loadingMessage');
            loadingMessage.style.display = 'block';
            exportBody.id = "blurred-background";
            
            setTimeout(function () {

                const hide = document.querySelectorAll('.hide');
                const npConInfo = document.querySelector('.left.noselect');
                const npConImg = document.querySelector('.center.noselect');
                const npConImgStyle = window.getComputedStyle(npConImg);
                const npConImgUrl = npConImgStyle.backgroundImage;
               
                npConImg.style.backgroundImage = 'none';
                npConInfo.style.opacity = '0';

                hide.forEach(function (div) {
                    div.style.display = 'none';
                });

                html2canvas(document.body, {
                    scale: 1,
                    allowTaint: true,
                    useCORS: true,
                    ignoreElements: function (element) {
                        return element.id === 'hideRender'; 
                    }

                }).then(function (canvas) {
                    const link = document.createElement('a');
                    const desiredWidth = 4096;
                    const desiredHeight = (canvas.height * desiredWidth) / canvas.width; 
                    const resizedCanvas = document.createElement('canvas');
                    resizedCanvas.width = desiredWidth;
                    resizedCanvas.height = desiredHeight;

                    const ctx = resizedCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, 0, desiredWidth, desiredHeight);

                    const imgData = resizedCanvas.toDataURL('image/png');
                    link.href = imgData;

                    var nexportWindow = window.open('', '', 'height=600,width=800');
                    nexportWindow.document.title = 'NP Converter - Export PNG';

                    nexportWindow.document.body.innerHTML = `
                    <style>
                        body {
                            background-color: #ccc;
                            background: linear-gradient(315deg, #251F2E 0%, #251F2E 100%);
                        }

                        .ok {
                            padding: 10px 20px;
                            background-color: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        }

                        .ok:hover {
                            background-color: #2ecc71;
                        }

                        .divstyle {
                            padding: 20px; 
                            display: flex; 
                            justify-content: center; 
                            flex-direction: column; 
                            align-items: center;
                        }

                        .bordercolor {
                            border: 5px solid #ccc;
                        }
                    </style>

                    <div class="divstyle">
                        <a href="${imgData}" download="np_converter_export.png" style="text-decoration: none;">
                            <button class="ok">
                                Download PNG
                            </button>
                        </a>  
                    </div>     
                    <div class="divstyle bordercolor">
                        <img src="${imgData}" alt="NP Converter Screenshot" style="max-width:100%; margin-bottom: 20px;"/>
                    </div>
                    `;

                    loadingMessage.style.display = 'none';
                    exportBody.id = "";

                }).catch(function (error) {
                    console.error('Error capturing the page:', error);
                    loadingMessage.style.display = 'none';
                    exportBody.id = "";
                });
                
                npConInfo.style.opacity = '1';
                npConImg.style.backgroundImage = npConImgUrl;

                hide.forEach(function (div) {
                    div.style.display = 'block';
                });

            }, 100); 
        });

    }
});
