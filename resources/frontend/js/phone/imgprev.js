function processMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        let messageText = message.querySelector(".text");

        if (!!messageText) {
            let updatedContent = logsPhonebookCheck(messageText.innerHTML);
            updatedContent = makeLinksClickable(updatedContent);

            messageText.innerHTML = updatedContent;
        }
    });
}
function isImgUrl(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url)
}
//////// Create link urls with shorter
function makeLinksClickable(messageContent) {
    const urlRegex = /(https?:\/\/|www\.)\S+/g;
    return messageContent.replace(urlRegex, (url) => {
        let formattedUrl = url.startsWith('http') ? url : `http://${url}`;
        let displayText = url.length > 50 ? `${url.slice(0, 50)}...` : url;
        const anchorTag = document.createElement('a');
        anchorTag.href = formattedUrl;
        anchorTag.textContent = displayText;
        anchorTag.target = '_blank';

        previewEventListener(url, anchorTag);

        return anchorTag.outerHTML;
    });
}

function previewEventListener(url, anchorTag) {
    if (isImgUrl(url)) {
        console.log("Trigger: previewEventListener");

            anchorTag.addEventListener("mouseover", function (event) {
                console.log("hit mouseover");
                showImagePreview(event, url);
            });

            anchorTag.addEventListener("mousemove", function (event) {
                console.log("hit mousemove");
                moveImagePreview(event);
            });

            anchorTag.addEventListener("mouseout", function () {
                console.log("hit mouseout");
                hideImagePreview();
                hideErrorMessage();
            });
        
        
    };
}
//////// Create Preview / Img tag [Tryed buggy maybe a way dont know]
/*
function createPreview(messageContent, devparent) {
    const urlRegex = /(https?:\/\/|www\.)\S+/g;
    const updatedContent = messageContent.replace(urlRegex, (url) => {
        let formattedUrl = url.startsWith('http') ? url : `http://${url}`;
        formattedUrl = formattedUrl.replace(`"`, '')
        if (isImgUrl(formattedUrl)) {

            const anchorTag = document.createElement('a');
            anchorTag.href = formattedUrl;
            anchorTag.target = '_blank';  
            anchorTag.classList.add('preview-image'); 

            const imgTag = document.createElement('img');
            imgTag.src = formattedUrl;
            imgTag.alt = 'Preview';
            imgTag.classList.add('preview-image'); 
            imgTag.outerHTML;
            anchorTag.appendChild(imgTag);
            console.log(imgTag);
            console.log(anchorTag);
            
        }
        return `${formattedUrl}`;
    });

    return updatedContent; 

};
*/

// OLD Preview Stuff
function showImagePreview(event, link) {
    const preview = document.getElementById('imagePreview');
    preview.src = link;
    preview.style.display = 'block';
    moveImagePreview(event);


    preview.onerror = function () {
        preview.style.display = 'none';
        showErrorMessage(event);
    }
}

function moveImagePreview(event) {
    const preview = document.getElementById('imagePreview');
    preview.style.top = `${event.pageY + 15}px`; // 15px Offset to mouse
    preview.style.left = `${event.pageX + 15}px`;


    const error = document.getElementById('errorMessagePIC');
    error.style.top = `${event.pageY + 15}px`;
    error.style.left = `${event.pageX + 15}px`;
}

function hideImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.style.display = 'none';
}

function showErrorMessage(event) {
    const error = document.getElementById('errorMessagePIC');
    error.style.display = 'block';
    error.style.top = `${event.pageY + 15}px`; // 15px Offset to mouse
    error.style.left = `${event.pageX + 15}px`;
}

function hideErrorMessage() {
    const error = document.getElementById('errorMessagePIC');
    error.style.display = 'none';
}
/*
const observer = new MutationObserver(processMessages);
observer.observe(document.body, { childList: true, subtree: true });
*/