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
        imgElement.alt = `Preview: ${href}`;
  
        imgElement.style.maxWidth = '200px';
        imgElement.style.minHeight = '200px';
        imgElement.style.maxHeight = '200px';

        link.appendChild(imgElement);
        embed.appendChild(link);

    }
    return embed;
}

