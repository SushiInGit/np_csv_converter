function simownerName(number) {
    for (const record of backend.dataController.getPhonenumbers()) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return "Unknown Contact";
}

if (backend.storageSelector.searchRecord('', true, 'last') !== false) {

    document.addEventListener("DOMContentLoaded", function () {
        const bannerRight = document.querySelector(".banner .right.noselect");
        const data = middleman.requestData.all();
        let dialoguePartners = Object.keys(middleman.requestData.allMetadata()).length + 0;

        if (bannerRight && Object.keys(data).length > 0) {
            bannerRight.innerHTML = `
            Total Data: ${middleman.phoneData.infoCountOverall(data)}<br>
            Total Calls: ${middleman.phoneData.infoCountIscall(data)}<br> 
            Total Messages: ${middleman.phoneData.infoCountMessage(data)}<br>
            Dialogue Partners: ${dialoguePartners} 
        `;
        }

        const bannerCenter = document.querySelector(".banner .center.noselect");
        if (bannerCenter && Object.keys(data).length > 0) {
            bannerCenter.innerHTML = `
            <h2>${simownerName(middleman.simOwner.number())}</h2>
            <h3>${String(middleman.simOwner.number()).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}</h3>
            <b>${processTimestamp(data[0].Timestamp).date} to ${processTimestamp(data[(Object.keys(data).length - 1)].Timestamp).date}</b>
        `;
        }

    });

};


function importChange() {
    const popup = document.getElementById('popup');
    if (popup.classList.contains('import') && popup.classList.contains('show')) {
        const textarea = document.getElementById('textarea');
        const lineNumbersEle = document.getElementById('line-numbers');

        const textareaStyles = window.getComputedStyle(textarea);
        [
            'fontFamily',
            'fontSize',
            'fontWeight',
            'letterSpacing',
            'lineHeight',
            'padding',
        ].forEach((property) => {
            lineNumbersEle.style[property] = textareaStyles[property];
        });

        const parseValue = (v) => v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0;

        const font = `${textareaStyles.fontSize} ${textareaStyles.fontFamily}`;
        const paddingLeft = parseValue(textareaStyles.paddingLeft);
        const paddingRight = parseValue(textareaStyles.paddingRight);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;

        const calculateNumLines = (str) => {
            const textareaWidth = textarea.getBoundingClientRect().width - paddingLeft - paddingRight;
            const words = str.split(' ');
            let lineCount = 0;
            let currentLine = '';
            for (let i = 0; i < words.length; i++) {
                const wordWidth = context.measureText(words[i] + ' ').width;
                const lineWidth = context.measureText(currentLine).width;

                if (lineWidth + wordWidth > textareaWidth) {
                    lineCount++;
                    currentLine = words[i] + ' ';
                } else {
                    currentLine += words[i] + ' ';
                }
            }

            if (currentLine.trim() !== '') {
                lineCount++;
            }

            return lineCount;
        };

        const calculateLineNumbers = () => {
            const lines = textarea.value.split('\n');
            const numLines = lines.map((line) => calculateNumLines(line));

            let lineNumbers = [];
            let i = 1;
            while (numLines.length > 0) {
                const numLinesOfSentence = numLines.shift();
                lineNumbers.push(i);
                if (numLinesOfSentence > 1) {
                    Array(numLinesOfSentence - 1)
                        .fill('')
                        .forEach((_) => lineNumbers.push(''));
                }
                i++;
            }

            return lineNumbers;
        };

        const displayLineNumbers = () => {
            const lineNumbers = calculateLineNumbers();
            lineNumbersEle.innerHTML = Array.from({
                length: lineNumbers.length
            }, (_, i) => `<div>${lineNumbers[i] || '&nbsp;'}</div>`).join('');
        };

        textarea.addEventListener('input', () => {
            displayLineNumbers();
        });

        displayLineNumbers();

        const ro = new ResizeObserver(() => {
            const rect = textarea.getBoundingClientRect();
            lineNumbersEle.style.height = `${rect.height}px`;
            displayLineNumbers();
        });
        ro.observe(textarea);

        textarea.addEventListener('scroll', () => {
            lineNumbersEle.scrollTop = textarea.scrollTop;
        });

    }
};

const observer = new MutationObserver(() => {
    importChange();
});

const config = {
    attributes: true,
    attributeFilter: ['class']
};

observer.observe(popup, config);

