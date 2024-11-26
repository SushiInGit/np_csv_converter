var backend = backend ?? {};

backend.markdownHelper = (function () {
    const helpDiv = document.getElementById("help");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {   // Close Popups
        if (event.key === "Escape") {
            backend.markdownHelper.closeHelp();
            window.dispatchEvent(new Event('unload'));
        }
    });

    /**
    * Create Help popup
    * @param {*} popupDivName </> name
    * @param {*} title Header-title
    * @param {*} file md-filename
    **/
    function createPopup(popupDivName, title, file) {
        frontend.renderModel.closePopupDiv();

        setTimeout(() => {
            showHelp();
            window.dispatchEvent(new Event('load'));
            loader.classList.add("active");
            helpDiv.classList.add(popupDivName);
            const helpDivHead = document.createElement(popupDivName);
            helpDivHead.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="backend.markdownHelper.closeHelp(), window.dispatchEvent(new Event('unload'));">X</button>
                    <!-- <div class="icon-container help"><span class="icon">question_mark</span></div> -->
                    <h2>${title}</h2>
                </div>
                
                <div class="element">
                <div class="md">
                <div class="tocBody">
                    <div id="toc"></div>
                </div>
                <div id="markdownContent"></div>
                </div>
                </div>
            </div>   
            `;
            helpDiv.appendChild(helpDivHead);

            setTimeout(() => {
                backend.markdownHelper.fetchMarkdown(file);
                window.dispatchEvent(new Event('unload'));
            }, 10);
        }, 50);

    }

    /**
    * Open help popup
    **/
    function showHelp() {
        helpDiv.innerHTML = '';
        loader.classList.add('active');
        helpDiv.classList.remove("hide");
        helpDiv.classList.add("show");
    }

    /**
    * Close help popup
    **/
    function closeHelp() {
        helpDiv.innerHTML = '';
        const classesToRemove = ["hide", "show", "help"];
        classesToRemove.forEach(className => {
            helpDiv.classList.remove(className);
        });
        loader.classList.remove('active');
        helpDiv.classList.add("hide");
    }

    /**
    * Load md-file from URL
    * @param {*} file filename
    **/
    async function fetchMarkdown(file) {
        const apiUrl = `https://api.github.com/repos/SushiInGit/np_csv_converter/contents/resources/help/${file}`;

        try {
            const response = await fetch(apiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });

            if (!response.ok) throw new Error('Failed to fetch file');

            const markdownText = await response.text();
            renderMD(markdownText);

        } catch (error) {
            console.error('Error fetching the Markdown file:', error);
        }
    }

    /**
    * Render markdown-file in div('markdownContent')
    **/
    function renderMD(content) {
        const contentDiv = document.getElementById('markdownContent');
        contentDiv.innerHTML = marked.parse(content);
        generateTOC();
    }

    /**
    * Create Sidemenu in div ('toc')
    **/
    function generateTOC() {
        const tocContainer = document.getElementById('toc');
        tocContainer.innerHTML = '';

        const contentDiv = document.getElementById('markdownContent');
        const headers = contentDiv.querySelectorAll("h3, strong");

        headers.forEach(header => {
            const tocItem = document.createElement("div");
            tocItem.innerText = header.innerText;
            tocItem.className = header.tagName === "STRONG" ? "toc-subitem" : "toc-item";

            if (!header.id) header.id = header.innerText.replace(/\s+/g, '-').toLowerCase();

            tocItem.onclick = () => {
                document.getElementById(header.id).scrollIntoView({ behavior: "smooth" });
            };

            tocContainer.appendChild(tocItem);
        });
    }

    return {
        createPopup: createPopup,
        closeHelp: closeHelp,
        fetchMarkdown: fetchMarkdown
    };

})();
