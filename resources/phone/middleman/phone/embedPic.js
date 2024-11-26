var middleman = middleman ?? {};

middleman.embedPic = function (message) {
    const embed = document.createElement('div');
    //const anchorTagRegex = /<a href="(.*?)"[^>]*>\[img\](.*?)\[\/img\]<\/a>/g;
    const anchorTagRegex = /<a\s+[^>]*href="(.*?)"[^>]*class\s*=\s*["']?picture["']?[^>]*>(.*?)<\/a>/g;
    let match;

    const allowedURLs = ['kappa.lol', 'imgur.com', 'postimg.cc', 'gyazo.com'];
    while ((match = anchorTagRegex.exec(message)) !== null) {
        const href = match[1];
        embed.classList.add('embed');

        const isURL = allowedURLs.some(url => href.includes(url));
        const isImage = /\.(png|jpg|jpeg|gif|bmp|svg|webp)$/i.test(href);

        if (isImage || isURL) {
            const link = document.createElement('a');
            link.href = href;
            link.target = '_blank';

            const imgElement = document.createElement('img');
            imgElement.src = href;
            imgElement.alt = `404 Image not found.`;

            // Add the onerror attribute for fallback
            imgElement.onerror = function () {
                this.onerror = null;
                this.src = 'https://sushiingit.github.io/np_csv_converter/resources/public/image/404image.png';
                this.style.filter = 'none';
            };


            link.appendChild(imgElement);
            embed.appendChild(link);
        }
    }
    return embed;
}

