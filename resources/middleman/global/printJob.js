var middleman = middleman ?? {};

middleman.printJob = function () {
    
    function printDiv(divId) {
        let pageDate = [];
        pageDate.head = document.querySelector(".banner").innerHTML;
        pageDate.log = document.querySelector(".output .messages").innerHTML;
        pageDate.footer = document.querySelector("footer").innerHTML;

        //var newWindow = window.open('', '', 'height=600,width=800');
        var newWindow = window.open();
        newWindow.document.write('<html><head><title>NP Converter Print View</title>');
        newWindow.document.write('<link rel="stylesheet" type="text/css" href="resources/frontend/css/phone/print.css">');
        newWindow.document.write('<script defer src="resources/backend/vendors/html2canvas.min.js"></script>');

        newWindow.document.write('</head><body id="capture">');
        newWindow.document.write('<div class="buttons"><button class="ok" onclick="window.print()">Print (for PDF)</button> <button class="ok" id="captureButton">Create PNG</button></div>');
        newWindow.document.write('<div class="banner">');
        newWindow.document.write(pageDate.head);

        newWindow.document.write('</div>');

        newWindow.document.write('<div class="output" style="grid-area: 1/1/5/7"><div class="messages">');
        newWindow.document.write(pageDate.log);
        newWindow.document.write('</div></div>');
        newWindow.document.write('<footer>');
        newWindow.document.write(pageDate.footer);
        newWindow.document.write('</footer>');
        newWindow.document.write('<script defer src="resources/middleman/global/printJobFunction.js"></script>');

        newWindow.document.write('</body></html>');
        newWindow.document.close(); 
    }
    return {
        printJob : printDiv
      }
    }();
    