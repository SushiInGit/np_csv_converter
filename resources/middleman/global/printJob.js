var middleman = middleman ?? {};

middleman.printJob = function () {
  function printDiv(to_name, to_nr, owner_nr) {
    let userData = [];
    let pageDate = [];

    pageDate.head = document.querySelector(".banner").innerHTML;
    pageDate.log = document.querySelector(".output .messages").innerHTML;
    pageDate.footer = document.querySelector("footer").innerHTML;

    const nameMatch = pageDate.head.match(/<h2>(.*?)<\/h2>/);
    userData.Simowner_Name = nameMatch ? nameMatch[1] : null;


    userData.To_Name = to_name;
    userData.To_Nr = String(to_nr).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3");
    userData.Simowner_Nr = String(owner_nr).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3");

    userData.To = userData.To_Name === "Unknown Contact" ? "<small><i>#" + userData.To_Nr + "</i></small>" : userData.To_Name + " <small><i>#" + userData.To_Nr + "</i></small>";
    userData.Simowner = userData.Simowner_Name === "Unknown Contact" ? "<small><i>#" + userData.Simowner_Nr + "</i></small>" : userData.Simowner_Name + " <small><i>#" + userData.Simowner_Nr + "</i></small>";


    pageDate.head = pageDate.head.replace(
      /<div class="center noselect">[\s\S]*?<\/div>/,
      `<div class="center noselect">
              <h2>Communication Logs</h2>
              <h3>${userData.Simowner}</h3>
              <h3><i>and</i></h3>
              <h3>${userData.To}</h3>
          </div>`
    );

    //var newWindow = window.open('', '', 'height=600,width=800');
    var newWindow = window.open();
    newWindow.document.title = 'NP Converter Print View';
    newWindow.document.write('<html><head><title>NP Converter Print View</title>');
    newWindow.document.write('<link rel="stylesheet" type="text/css" href="resources/frontend/css/phone/print.css">');
    newWindow.document.write('<script defer src="resources/backend/vendors/html2canvas.min.js"></script>');

    newWindow.document.write('</head><body id="capture">');
    newWindow.document.write(`
      <div class="help">
      <center><h2>Exporting Logs with Visibility Controls</h2></center>
        <div class="helptext">
          <p>When interacting with logs, you have the ability to manage which entries are visible or hidden. By clicking on a log entry, you can toggle its visibility:</p>
          <ul>
              <li><strong>Visible Logs</strong>: Logs are displayed normally, fully opaque and readable.</li>
              <li><strong>Hidden Logs</strong>: When hidden, the log entries appear in a <span style="opacity: 0.5; text-decoration: line-through;">semi-transparent style with a strikethrough</span>, indicating they are deactivated and will not be included in the export.</li>
          </ul>
          <p>This flexible visibility control allows you to customize the logs you want to export, ensuring that only relevant information is included.</p>
        </div>
      
      <div class="buttons">
      <button class="ok" id="captureButton">Create PNG</button>
      </div>
      <hr class="helphr">
      </div>
      `);
      newWindow.document.write('<div class="logBody">');
    newWindow.document.write('<div class="banner">');
    newWindow.document.write(pageDate.head);

    newWindow.document.write('</div>');

    newWindow.document.write('<div class="output" style="grid-area: 1/1/5/7"><div class="messages">');
    newWindow.document.write(pageDate.log);
    newWindow.document.write('</div></div>');
    newWindow.document.write('</div>');
    newWindow.document.write('<footer>');
    newWindow.document.write(pageDate.footer);
    newWindow.document.write('</footer>');
    newWindow.document.write('<script defer src="resources/middleman/global/printJobFunction.js"></script>');

    newWindow.document.write('</body></html>');
    newWindow.document.close();

  }
  return {
    printJob: printDiv
  }
}();
