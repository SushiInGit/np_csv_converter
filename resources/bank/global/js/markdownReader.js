var global = global ?? {};

global.markdownReader = function (fileName) {
    const baseUrl = 'https://raw.githubusercontent.com/SushiInGit/np_csv_converter/refs/heads/main/resources/help/';
    const markdownUrl = `${baseUrl}${fileName}`;

    fetch(markdownUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(markdown => {
            const html = marked(markdown);
            const htmlWithLinks = html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

            document.getElementById('markdownContent').innerHTML = htmlWithLinks;
        })
        .catch(error => {
            document.getElementById('markdownContent').textContent = 'Error loading Markdown file: ' + error.message;
        });
};