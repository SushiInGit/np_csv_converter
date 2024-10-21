var middleman = middleman ?? {};

middleman.printJob = function () {

    function printDiv(divId) {
        var printContents = document.querySelector(".output .messages").innerHTML;
        var originalContents = document.body.innerHTML;

        // Neues Fenster öffnen
        var newWindow = window.open('', '', 'height=600,width=800');
        newWindow.document.write('<html><head><title>Print View</title>');
        // Füge hier das CSS ein
        newWindow.document.write('<link rel="stylesheet" type="text/css" href="resources/frontend/css/phone/main.css">');
        newWindow.document.write('<link rel="stylesheet" type="text/css" href="resources/frontend/css/phone/logs.css">');
        newWindow.document.write('<link rel="stylesheet" type="text/css" href="resources/frontend/css/phone/print.css">');
        newWindow.document.write('</head><body>');
        newWindow.document.write('<container1><div class="grid-wrapper"><div class="output" style="grid-area: 1/1/5/7"><div class="messages">');
        newWindow.document.write(printContents);
        newWindow.document.write('</div><div class="spacer"></div></div></div></container1>');
        newWindow.document.write('</body></html>');
    
        newWindow.document.close(); 
        setTimeout(function() {
            //newWindow.print(); 
            //newWindow.close(); 
        }, 1000);
    }
    return {
        pringJob: printDiv
      }
    }();
    