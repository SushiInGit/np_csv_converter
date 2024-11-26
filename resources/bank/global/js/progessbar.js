var global = global ?? {};

global.progressbar = (function () {
    const progressBarContainerSelector = ".progressbar";

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            global.progressbar.resetProgress()
        }
    });

    /**
    * Ensures the progress bar container is present and visible.
    **/
    function ensureProgressBarContainer() {
        window.dispatchEvent(new Event('load'));
        let container = document.querySelector(progressBarContainerSelector);
        if (!container) {
            container = document.createElement("div");
            container.className = "progressbar";
            document.body.appendChild(container);
        }
        container.style.display = "flex";
        return container;
    }

    /**
    * Creates a new progress bar with a given name.
    * @param {string} progressName - The name of the progress step (e.g., "Analyze").
    **/
    function createProgress(progressName) {
        const container = ensureProgressBarContainer();

        const existingProgress = Array.from(container.querySelectorAll(".progress"))
            .find(el => el.querySelector(".progress-name").textContent.trim() === progressName);

        if (existingProgress) {
            console.warn(`Progress "${progressName}" already exists.`);
            return;
        }

        const progress = document.createElement("div");
        progress.className = "progress";

        const progressNameDiv = document.createElement("div");
        progressNameDiv.className = "progress-name";
        progressNameDiv.textContent = progressName;

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        const progressPercentage = document.createElement("div");
        progressPercentage.className = "progress-percentage";
        progressPercentage.setAttribute("per", "0%");
        progressPercentage.style.maxWidth = "0%";

        progressBar.appendChild(progressPercentage);
        progress.appendChild(progressNameDiv);
        progress.appendChild(progressBar);
        container.appendChild(progress);
    }

    /**
    * Updates the progress bar for a given progress name.
    * Creates the progress bar dynamically if it does not exist.
    * @param {string} progressName - The name of the progress step (e.g., "Analyze").
    * @param {number} percentage - The completion percentage (e.g., 50 for 50%).
    **/
    function updateProgress(progressName, percentage) {
        const container = ensureProgressBarContainer();

        let progressElement = Array.from(container.querySelectorAll(".progress"))
            .find(el => el.querySelector(".progress-name").textContent.trim() === progressName);

        if (!progressElement) {
            createProgress(progressName);
            progressElement = Array.from(container.querySelectorAll(".progress"))
                .find(el => el.querySelector(".progress-name").textContent.trim() === progressName);
        }

        const percentageElement = progressElement.querySelector(".progress-percentage");
        percentageElement.setAttribute("per", `${percentage}%`);
        percentageElement.style.maxWidth = `${percentage}%`;
    }

    /**
    * Updates progress asynchronously to allow browser rendering updates.
    * @param {string} step - The progress step to update.
    * @param {number} percentage - The percentage to update.
    **/
    async function updateProgressAsync(step, percentage) {
        updateProgress(step, percentage);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Allow browser to render updates
    }

    /**
    * Hides the progress bar container and removes all progress elements.
    **/
    function resetProgress() {
        const container = document.querySelector(progressBarContainerSelector);
        if (container) {
            container.style.display = "none";
            container.innerHTML = "";
        }
        window.dispatchEvent(new Event('unload'));
    }

    return {
        createProgress,
        updateProgress: updateProgressAsync,
        resetProgress
    };
})();
