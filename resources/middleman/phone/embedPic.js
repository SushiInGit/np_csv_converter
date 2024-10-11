var middleman = middleman ?? {};

middleman.embedPic = function (message) {
    const embed = document.createElement('div');
    const anchorTagRegex = /<a href="(.*?)"[^>]*>\[img\](.*?)\[\/img\]<\/a>/g;
    let match;

    while ((match = anchorTagRegex.exec(message)) !== null) {
        const href = match[1];
        embed.classList.add('embed');

        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';

        const imgElement = document.createElement('img');
        imgElement.src = href;
        imgElement.alt = `404 Image not found.`;

        // Add the onerror attribute for fallback
        imgElement.onerror = function () {
            this.onerror = null;
            this.src = 'https://sushiingit.github.io/np_csv_converter/resources/frontend/image/404image.png';
            this.style.filter = 'none';
        };

        imgElement.style.maxHeight = '200px';
        imgElement.style.maxWidth = '200px';
        imgElement.style.height = 'auto';
        imgElement.style.width = 'auto';
        imgElement.style.objectFit = 'contain';


        link.appendChild(imgElement);
        embed.appendChild(link);

    }
    return embed;
}

