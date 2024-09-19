var middleman = middleman ?? {};

middleman.helper = function () {
  
  function findAllUrls(message) {  // Function to detect all URLs in the message
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.match(urlRegex) || [];
}

function isImage(url) { // Function to check if the URL is an image
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function isPhoneNumberWrapped(message, number) {
    const wrappedRegex = new RegExp(`(<(b|span)[^>]*?>[^<]*${phoneNumber}[^<]*<\\/\\2>)`, 'i');
    return wrappedRegex.test(message);
}

function isUrlWrapped(message, url) { // Function to check if a URL is already wrapped by HTML tags
    const wrappedRegex = new RegExp(`(<(a|img|span|b)[^>]*?>[^<]*${url}[^<]*<\\/\\2>)`, 'i');
    return wrappedRegex.test(message);
}

    return { 
        findAllUrls: (message) => { return findAllUrls(message) },
        isImage: (url) => { return isImage(url) },
        isPhoneNumberWrapped: (message, number) => { return isUrlWrapped(message, number) },
        isUrlWrapped: (message, url) => { return isUrlWrapped(message, url) },

    }
}();