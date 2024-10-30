var middleman = middleman ?? {};

middleman.printJob = function () {
	function printDiv(to_id, to_title, from_id, from_title, type) {
		let pageDate = [];

		pageDate.head = document.querySelector(".banner").innerHTML;
		pageDate.log = document.querySelector(".output .messages .table").innerHTML;
		pageDate.footer = document.querySelector("footer").innerHTML;

		const nameMatch = pageDate.head.match(/<h2>(.*?)<\/h2>/);

		type === "user" ?
			pageDate.head = pageDate.head.replace(
				/<div class="center noselect">[\s\S]*?<\/div>/,
				`<div class="center noselect">
					<h2>Bank Logs</h2>
					<h3>${to_title} ( ID: ${to_id} )</h3>
					<h3><i>and</i></h3>
					<h3>${from_title} ( ID: ${from_id} )</h3>
				</div>`
			)
			:
			pageDate.head = pageDate.head.replace(
				/<div class="center noselect">[\s\S]*?<\/div>/,
				`<div class="center noselect">
					<h2>Bank Logs</h2>
					<h3>${to_title} ( ID: ${to_id} )</h3>
					<h3>&nbsp;</h3>
					<h3>&nbsp;</h3>
				</div>`
			);

		pageDate.log = pageDate.log.replace(
			/<div class="filter">[\s\S]*?<\/div>/,
			``
		).replace(
			/<div class="vue-treeselect__control-arrow-container">[\s\S]*?<\/div>/,
			``
		).replace(
			/<div class="vue-treeselect__input-container">[\s\S]*?<\/div>/,
			``
		);

		var createExport = window.open();
		createExport.document.write(`
			<html><head>
			<title>NP Converter Print View</title>
			<link rel="preload" href="resources/frontend/css/bank/print.css" as="style" onload="this.rel='stylesheet'">
			<link rel="preload" href="resources/frontend/css/bank/bankTable.css" as="style" onload="this.rel='stylesheet'">
			<link rel="preload" href="resources/frontend/css/global/alertsystem.css" as="style" onload="this.rel='stylesheet'">
			<script defer src="resources/frontend/js/global/alertsystem.js"></script>
			<script defer src="resources/backend/vendors/html2canvas.min.js"></script>
			</head>
			<div id="alert-container" class="noselect"></div>
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
					<p>Note: To view additional details, enable the relevant columns (like 'Tax', 'ID' and so on...) on the main page. This configuration will also be reflected in the exported display, ensuring that all selected information is included.</p>
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
			<script defer src="resources/middleman/bank/printJobFunction.js"></script>
			</body></html>
		`);

		createExport.document.close();
	}
	return {
		printJob: printDiv
	}
}();
