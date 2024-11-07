var middleman = middleman ?? {};

middleman.helper = function () {
  
  function findAllUrls(message) {  // Function to detect all URLs in the message
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    return message.match(urlRegex) || [];
}

function isImage(url) { // Function to check if a URL is an image
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const wrappedRegex = new RegExp(`\\.(${imageExtensions.join('|')})(\\?.*)?$`, 'i');
    return wrappedRegex.test(url);
}

function isPhoneNumberWrapped(message, number) { // Function to check if a IMG is already wrapped
    const wrappedRegex = new RegExp(`(<(b|span)[^>]*?>[^<]*${number}[^<]*<\\/\\2>)`, 'i');
    return wrappedRegex.test(message);
}

function isUrlWrapped(message, url) { // Function to check if a URL is already wrapped
    const wrappedRegex = new RegExp(`(<(a|img|span|b)[^>]*?>[^<]*${url}[^<]*<\\/\\2>)`, 'i');
    return wrappedRegex.test(message);
}

function jumpTopLog() {
    const targetDiv = document.querySelector('.output .messages');
    targetDiv.style.scrollBehavior = 'auto';
    targetDiv.scrollTop = 0;
    setTimeout(() => {
        targetDiv.style.scrollBehavior = 'smooth';
    }, 0);
}

    return { 
        findAllUrls: (message) => { return findAllUrls(message) },
        isImage: (url) => { return isImage(url) },
        isPhoneNumberWrapped: (message, number) => { return isPhoneNumberWrapped(message, number) },
        isUrlWrapped: (message, url) => { return isUrlWrapped(message, url) },
        jumpTopLog: () => { return jumpTopLog() }
    }
}();