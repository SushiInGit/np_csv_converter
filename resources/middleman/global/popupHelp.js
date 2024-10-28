var middleman = middleman ?? {};

middleman.popupHelp = (function () {
    const helpDiv = document.getElementById("help");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {   // Close Popups
        if (event.key === "Escape") {
            middleman.popupHelp.closeHelp();
            middleman.popupModel.deactivateLoader();
        }
    });

    function createPopup(popupDivName, title, file) {
        middleman.popupModel.closePopupDiv(); // Cloth other popups first
        setTimeout(() => {
            showHelp();
            loader.classList.add("active"); // Activate loader
            helpDiv.classList.add(popupDivName);
            const helpDivHead = document.createElement(popupDivName);
            const helpDivBody = document.createElement(popupDivName);
            helpDivHead.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="middleman.popupHelp.closeHelp(), middleman.popupModel.deactivateLoader()">X</button>
                    <h2>${title}</h2>
                </div>
                
                <div class="element">
                <div class="md">
                <div id="toc"></div>
                <div id="markdownContent"></div>
                </div>
                </div>
            </div>   
            `;
            helpDiv.appendChild(helpDivHead);
            
            setTimeout(() => {
                middleman.popupHelp.fetchMarkdown();
            }, 10);
        }, 50);

    }


    function showHelp() {
        helpDiv.innerHTML = '';
        loader.classList.add('active');
        helpDiv.classList.remove("hide");
        helpDiv.classList.add("show");
    }

    function closeHelp() {
        helpDiv.innerHTML = '';
        const classesToRemove = ["hide", "show", "help"];
        classesToRemove.forEach(className => {
            helpDiv.classList.remove(className);
        });
        loader.classList.remove('active');
        helpDiv.classList.add("hide");
    }




    const apiUrl = 'https://api.github.com/repos/SushiInGit/np_csv_converter/contents/resources/help/phone.md';

    async function fetchMarkdown() {
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

    function renderMD(content) {
        const contentDiv = document.getElementById('markdownContent');
        contentDiv.innerHTML = marked.parse(content); 
        generateTOC();
      }

      function generateTOC() {
        const tocContainer = document.getElementById('toc');
        tocContainer.innerHTML = ''; 
      
        const contentDiv = document.getElementById('markdownContent');
        const headers = contentDiv.querySelectorAll("h1, h2, h3, strong");
      
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
