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

		var createExport = window.open();
		createExport.document.write(`
			<html><head>
			<title>NP Converter Print View</title>
			<link rel="preload" href="resources/frontend/css/phone/print.css" as="style" onload="this.rel='stylesheet'">
			<script defer src="resources/backend/vendors/html2canvas.min.js"></script>
			</head>
			<div id="hideRender" class="loadingMessage" style="display: none;">
				<center><h2>Please wait! Image is generating...</h2></center>
			</div>
			<body id="capture">
			<div class="exportBody"><div class="banner">${pageDate.head}</div>
			<div class="help" id="hideRender">
				<hr class="helphr" id="hideRender">
				<center><h2>Exporting Logs with Visibility Controls</h2></center>
				<div class="helptext">
					<p>When interacting with logs, you have the ability to manage which entries are visible or hidden. By clicking on a log entry, you can toggle its visibility:</p>
					<ul>
						<li><strong>Visible Logs</strong>: Logs are displayed normally, fully opaque and readable.</li>
						<li><strong>Hidden Logs</strong>: When hidden, the log entries appear in a <span style="opacity: 0.5; text-decoration: line-through;">semi-transparent style with a strikethrough</span>, indicating they are deactivated and will not be included in the export.</li>
					</ul>
					<p>This flexible visibility control allows you to customize the logs you want to export, ensuring that only relevant information is included.</p>
					<p>Note: The Placeholder Image (404 Image not found) from NP-Converter will not appear in the PNG export.</p>
					</div>
					<div class="buttons">
						<button class="ok" id="captureButton">Create PNG</button>
					</div>
					<hr class="helphr" id="hideRender">
				</div>
				<div class="logBody">
					<div class="output" style="grid-area: 1/1/5/7">
						<div class="messages">${pageDate.log}</div>
					</div>
				</div>
			</div>
			<footer id="hideRender">${pageDate.footer}</footer>
			<script defer src="resources/middleman/phone/printJobFunction.js"></script>
			</body></html>
		`);

		createExport.document.close();
	}
	return {
		printJob: printDiv
	}
}();
