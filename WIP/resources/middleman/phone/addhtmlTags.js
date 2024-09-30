var middleman = middleman ?? {};

middleman.addhtmlTags = function () {

  function conversationFilter(message) {
    const urls = middleman.helper.findAllUrls(message);

    if (!middleman.helper.isUrlWrapped(message)) {
      element = formatPhoneNumbers(message);
      for (const url of urls) {
        if (middleman.helper.isUrlWrapped(element, url)) {
          console.info(`${url} is already wrapped or corrupt url)`);
          continue; // Skip this URL if it is already wrapped in HTML tags
        }
        const isImg = middleman.helper.isImage(url);
        if (isImg) {
          const shortenedUrl = (url.length > 30 ? url.slice(0, 30) + '...' : url);
          const imgTag = `<a href="${url}" target="_blank" class="picture">[img]${shortenedUrl}[/img]</a>`;
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

  function formatPhoneNumbers(message) { // Function to wrap phone numbers in <???> tags
    if (message !== null) {
      const phoneRegex = /\b420\d{7}\b/g;
      const pointer = message;
      return pointer.replace(phoneRegex, (match) => {
        if (middleman.helper.isPhoneNumberWrapped(message, match)) {
          return match; // Return the original phone number if it's already wrapped
        }
       // return `<b>${match}</b>`; // Wrap the phone number in <b> tags if not wrapped
       return `${match}`;
      });

    };
  }

  return {
    conversationFilter: (message) => { return conversationFilter(message) } // Used in renderLogs.js
  }
}();



