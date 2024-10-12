var middleman = middleman ?? {};

middleman.addhtmlTags = function () {

  function conversationFilter(message) {
    const urls = middleman.helper.findAllUrls(message);

    if (!middleman.helper.isUrlWrapped(message)) {
      element = formatPhoneNumbers(message);
      for (const url of urls) {

        if (middleman.helper.isUrlWrapped(element, url)) {
          console.info(`${url} is already wrapped or corrupt url)`);
          continue;
        }

        const isImg = middleman.helper.isImage(url);

        if (isImg) {
          const shortenedUrl = (url.length > 30 ? url.slice(0, 30) + '...' : url);
          //const imgTag = `<a href="${url}" target="_blank" class="picture">[img]${shortenedUrl}[/img]</a>`;
          const imgTag = `<a href="${url}" target="_blank" class="picture">${shortenedUrl}</a>`;
          element = element.replace(url, imgTag);
          
        } else {
          const shortenedUrl = url.length > 50 ? url.slice(0, 50) + '...' : url;
          const linkTag = `<a href="${url}" target="_blank" class="link">${shortenedUrl}</a>`;
          element = element.replace(url, linkTag);
        }
      }
    }
    return element;
  }

  function formatPhoneNumbers(message) {
    if (message !== null) {
      const phoneRegex = /\b420\d{7}\b/g;
      const pointer = message;

      return pointer.replace(phoneRegex, (match) => {

        if (middleman.helper.isPhoneNumberWrapped(message, match)) {
          return match;
        }

        return `<b><number>${match}</number></b>`;

      });
    };
  }

  return {
    conversationFilter: (message) => { return conversationFilter(message) } // Used in renderLogs.js
  }
}();



