var middleman = middleman ?? {};

middleman.addhtmlTags = function () {

  function formatPhoneNumbers(message) { // Function to wrap phone numbers in <???> tags
    if(message !== null){
    const phoneRegex = /\b420\d{7}\b/g;
    const pointer = message;
    return pointer.replace(phoneRegex, (match) => {
      if (middleman.helper.isPhoneNumberWrapped(message, match)) {
        return match; // Return the original phone number if it's already wrapped
      }
      return `<b>${match}</b>`; // Wrap the phone number in <b> tags if not wrapped
    });

  };
  }

  function processMessage(messages) {
    if (Object.keys(messages).length !== 0) {
      let storedTexts = JSON.parse(localStorage.getItem('texts')) || {};
      messages.forEach(msg => {
      if(msg.communications[0].IsCall === false){
        let element = msg.communications[0].Message;
        const urls = middleman.helper.findAllUrls(element);
        if (!middleman.helper.isUrlWrapped(element)) {
          // console.log("IF check number is formated: ",middleman.helper.isUrlWrapped(element)); // if false => format the numbers
          element = formatPhoneNumbers(element);           //////////// NEEDS STILL A cross check against telefonbook
        }
        if (Object.keys(urls).length !== 0) {
          for (const url of urls) {   // Process each URL
            if (middleman.helper.isUrlWrapped(element, url)) {
              console.log(`Skipping URL processing for: ${url} (already wrapped)`);
              continue; // Skip this URL if it is already wrapped in HTML tags
            }
            const isImg = middleman.helper.isImage(url);
            if (isImg) {
              const shortenedUrl = "IMAGE://" + (url.length > 30 ? url.slice(0, 30) + '...' : url);
              const imgTag = `<a href="${url}" target="_blank" class="previewable">${shortenedUrl}</a>`;
              element = element.replace(url, imgTag);
            } else {
              const shortenedUrl = url.length > 50 ? url.slice(0, 50) + '...' : url;
              const linkTag = `<a href="${url}" target="_blank" class="previewable">${shortenedUrl}</a>`;
              element = element.replace(url, linkTag);
            }
             msg.communications[0].Message = element;  // Update the original object with the modified message
            storedTexts[msg] = msg; 

          }

        }
        

      };

      



      });

      //localStorage.setItem('texts', JSON.stringify(storedTexts));
    }
    return messages;
  }

  return {
    processMessages: (message) => { return processMessage(message) }

  }
}
();



