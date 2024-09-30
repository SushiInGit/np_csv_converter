
var frontend = frontend ?? {};

frontend.renderChat = function (data) {


    ///////////////////////////////////////////////////    // Function to calculate the difference between two ISO timestamps
    function calculateCallDuration(start, end) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffMs = endTime - startTime;
        let minutes = '', seconds = '';
        // Convert milliseconds into minutes and seconds
        minutes = Math.floor(diffMs / 60000);
        seconds = ((diffMs % 60000) / 1000).toFixed(0);
        return `${minutes ? minutes : `0`} min ${seconds ? seconds : `0`} sec`;
    }

    let isCallTrueCount = 0;
    let isCallFalseCount = 0;

    data.communications.forEach(comm => {
        if (comm.IsCall) {
            isCallTrueCount++;
        } else {
            isCallFalseCount++;
        }
    });

    // Output-Header Left/Right
    const headerLeft = document.querySelector(".output .header.noselect .left");
    const headerRight = document.querySelector(".output .header.noselect .right");
    headerLeft.innerHTML = `To: ${data.Name} - ${String(data.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;
    headerRight.innerHTML = `[ Messages: ${isCallFalseCount} | Calls: ${isCallTrueCount} ]`;


    // Output-commOutput
    let gridLine = 1;
    let gridRow = 2;
    const commOutput = document.querySelector(".output .messages .commOutput");
    commOutput.innerHTML = ``;
    let lastDate = null;
    const commLogs = data.communications.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)); // Make sure the Object is sorted by Timestemp - 99.9999% will never be a problem

    commLogs.forEach(Log => {  // Date-Maker
        const currentDate = processTimestamp(Log.Timestamp).dateShowOffset;
        if (lastDate !== currentDate) {
            const dateMarker = document.createElement('div');
            dateMarker.classList.add('date-marker');
            dateMarker.style.gridArea = `${gridLine} / 3 / ${gridRow} / 4`;
            gridLine++;
            gridRow++;
            dateMarker.textContent = currentDate;
            commOutput.appendChild(dateMarker);
            lastDate = currentDate;
        }

        if (Log.IsCall) {
            const callMessageContainer = document.createElement('div');
            const callText = document.createElement('div');
            const callIndicator = document.createElement('div');
            const callDurationContainer = document.createElement('div');
            const callTimeContainer = document.createElement('div');
            const callBetween = document.createElement('div');
            callMessageContainer.classList.add('text');
            callIndicator.classList.add('callindicator');
            callText.classList.add('call');
            callText.style.gridArea = `${gridLine} / 2 / ${gridRow} / 5`;
            gridLine++;
            gridRow++;
            const callDuration = calculateCallDuration(Date.parse(Log.CallStart), Date.parse(Log.CallEnd));
            const fixedDate = processTimestamp(Date.parse(Log.Timestamp));

            if (Log.CallStart != null) {
                callDurationContainer.textContent = `Call duration: ${callDuration}`;
                callDurationContainer.classList.add('call-status');
                callTimeContainer.textContent = `${fixedDate.timeShowOffset} ${fixedDate.timeZone}`;
                callTimeContainer.classList.add('time');

                if (parseInt(middleman.simOwner.number()) === parseInt(Log.From)) {
                    callBetween.textContent = `Incoming call`;
                    callText.classList.add('callIn');
                    //callIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3545 22.2323C15.3344 21.7262 11.1989 20.2994 7.44979 16.5502C3.70068 12.8011 2.27383 8.66562 1.76771 6.64553C1.47684 5.48462 2.00061 4.36437 2.88872 3.73L5.21698 2.06697C6.57925 1.09391 8.47435 1.4241 9.42727 2.80054L10.8931 4.9178C11.5153 5.81654 11.3006 7.04833 10.4112 7.68369L9.24237 8.51853C9.41926 9.19513 9.96942 10.5846 11.6924 12.3076C13.4154 14.0306 14.8049 14.5808 15.4815 14.7577L16.3164 13.5889C16.9517 12.6994 18.1835 12.4848 19.0822 13.107L21.1995 14.5728C22.5759 15.5257 22.9061 17.4208 21.9331 18.7831L20.27 21.1113C19.6357 21.9994 18.5154 22.5232 17.3545 22.2323ZM8.864 15.136C12.2734 18.5454 16.0358 19.8401 17.8406 20.2923C18.1044 20.3584 18.4233 20.2559 18.6426 19.9488L20.3056 17.6206C20.63 17.1665 20.5199 16.5348 20.0611 16.2172L17.9438 14.7514L17.0479 16.0056C16.6818 16.5182 16.0047 16.9202 15.2163 16.7501C14.2323 16.5378 12.4133 15.8569 10.2782 13.7218C8.14313 11.5867 7.46222 9.76773 7.24991 8.78373C7.0798 7.99534 7.48184 7.31824 7.99442 6.95212L9.24868 6.05622L7.78288 3.93896C7.46524 3.48014 6.83354 3.37008 6.37945 3.69443L4.0512 5.35747C3.74416 5.57678 3.64165 5.89568 3.70774 6.15946C4.15992 7.96421 5.45462 11.7267 8.864 15.136Z" fill="#0F0F0F"/><path d="M18.4142 6.99997H21C21.5523 6.99997 22 7.44769 22 7.99997C22 8.55226 21.5523 8.99997 21 8.99997H17C15.8954 8.99997 15 8.10454 15 6.99997V2.99997C15 2.44769 15.4477 1.99997 16 1.99997C16.5523 1.99997 17 2.44769 17 2.99997V5.58574L21.2552 1.33055C21.6457 0.940028 22.2789 0.940027 22.6694 1.33055C23.0599 1.72108 23.0599 2.35424 22.6694 2.74477L18.4142 6.99997Z" fill="#0F0F0F"/></svg>`;
                } else {
                    callBetween.textContent = `Outgoing call`;
                    callText.classList.add('callOut');
                    //callIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3545 22.2324C15.3344 21.7262 11.1989 20.2994 7.44979 16.5503C3.70068 12.8012 2.27383 8.66565 1.76771 6.64556C1.47684 5.48465 2.00061 4.3644 2.88872 3.73003L5.21698 2.067C6.57925 1.09394 8.47435 1.42413 9.42727 2.80057L10.8931 4.91783C11.5153 5.81657 11.3006 7.04836 10.4112 7.68371L9.24237 8.51856C9.41926 9.19516 9.96942 10.5846 11.6924 12.3076C13.4154 14.0306 14.8049 14.5808 15.4815 14.7577L16.3164 13.5889C16.9517 12.6994 18.1835 12.4848 19.0822 13.107L21.1995 14.5728C22.5759 15.5257 22.9061 17.4208 21.9331 18.7831L20.27 21.1113C19.6357 21.9995 18.5154 22.5232 17.3545 22.2324ZM8.864 15.1361C12.2734 18.5454 16.0358 19.8401 17.8406 20.2923C18.1044 20.3584 18.4233 20.2559 18.6426 19.9489L20.3056 17.6206C20.63 17.1665 20.5199 16.5348 20.0611 16.2172L17.9438 14.7514L17.0479 16.0056C16.6818 16.5182 16.0047 16.9203 15.2163 16.7502C14.2323 16.5378 12.4133 15.8569 10.2782 13.7218C8.14313 11.5868 7.46222 9.76776 7.24991 8.78376C7.0798 7.99537 7.48184 7.31827 7.99442 6.95215L9.24868 6.05625L7.78288 3.93899C7.46524 3.48017 6.83354 3.37011 6.37945 3.69446L4.0512 5.3575C3.74416 5.57681 3.64165 5.89571 3.70774 6.15949C4.15992 7.96424 5.45462 11.7267 8.864 15.1361Z" fill="#0F0F0F"/><path d="M23 7C23 7.55228 22.5523 8 22 8C21.4477 8 21 7.55228 21 7V4.41421L16.7216 8.69265C16.331 9.08318 15.6979 9.08317 15.3073 8.69265C14.9168 8.30213 14.9168 7.66896 15.3073 7.27844L19.5858 3L17 3C16.4477 3 16 2.55228 16 2C16 1.44772 16.4477 1 17 1L21 1C22.1046 1 23 1.89543 23 3V7Z" fill="#0F0F0F"/></svg>`;
                };
                // Need to make from to trigger
                callBetween.classList.add('numbers');
            }

            if (Log.CallStart === null) {
                callDurationContainer.textContent = `Call could not be established!`;
                callDurationContainer.classList.add('call-status');
                callTimeContainer.textContent = `${fixedDate.timeShowOffset} ${fixedDate.timeZone}`;
                callTimeContainer.classList.add('time');
                if (parseInt(middleman.simOwner.number()) === parseInt(Log.From)) {
                    callText.textContent = `Incoming call`;
                } else {
                    callText.textContent = `Outgoing call`;
                }
                callBetween.classList.add('numbers');
                callText.classList.add('callFail');
                //callIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none"><path d="M10 1C10.5523 1 11 1.44772 11 2C11 2.55228 10.5523 3 10 3H8.41421L12.0429 6.62868L17.3787 1.2929C17.7692 0.902375 18.4024 0.902375 18.7929 1.2929C19.1834 1.68342 19.1834 2.31659 18.7929 2.70711L13.4592 8.04084C12.6823 8.81766 11.4255 8.82186 10.6434 8.05344C10.6163 8.02905 10.5896 8.0038 10.5635 7.97767L7 4.41422L7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6L5 3C5 1.89543 5.89543 1 7 1H10Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 12C6.8401 12 3.01237 13.8862 1.27396 14.9405C0.274923 15.5463 -0.135542 16.6912 0.0390736 17.7514L0.49684 20.5308C0.764683 22.157 2.29601 23.2467 3.89895 22.9518L6.36463 22.4982C7.41126 22.3056 8.11123 21.2984 7.93635 20.2365L7.70655 18.8413C8.29388 18.4933 9.62863 17.9088 12 17.9088C14.3714 17.9088 15.7061 18.4933 16.2935 18.8413L16.0637 20.2365C15.8888 21.2984 16.5887 22.3056 17.6354 22.4982L20.101 22.9518C21.704 23.2467 23.2353 22.157 23.5032 20.5308L23.9609 17.7514C24.1355 16.6912 23.7251 15.5463 22.726 14.9405C20.9876 13.8862 17.1599 12 12 12ZM2.2745 16.6299C3.82761 15.688 7.30768 13.9696 12 13.9696C16.6923 13.9696 20.1724 15.688 21.7255 16.6299C21.9525 16.7676 22.1014 17.061 22.041 17.4276L21.5833 20.207C21.494 20.749 20.9835 21.1123 20.4492 21.014L17.9836 20.5603L18.2302 19.063C18.3309 18.4511 18.1417 17.6997 17.4821 17.2691C16.6588 16.7317 14.9385 15.9392 12 15.9392C9.06148 15.9392 7.34118 16.7317 6.51793 17.2691C5.85834 17.6997 5.66906 18.4511 5.76984 19.063L6.01645 20.5603L3.55077 21.014C3.01646 21.1123 2.50602 20.749 2.41674 20.207L1.95897 17.4276C1.8986 17.061 2.04751 16.7676 2.2745 16.6299Z" fill="#0F0F0F"/></svg>`;
            }
            callMessageContainer.appendChild(callBetween);
            callMessageContainer.appendChild(callDurationContainer);
            callMessageContainer.appendChild(callTimeContainer);

            callText.appendChild(callIndicator);
            callText.appendChild(callMessageContainer);
            commOutput.appendChild(callText);
        } else {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(Log.From === middleman.simOwner.number() ? 'from' : 'to');
            pointerFromTo = Log.From === middleman.simOwner.number() ? 'from' : 'to';
            if (pointerFromTo === "to") {
                messageDiv.style.gridArea = `${gridLine} / 1 / ${gridRow} / 3`;
                gridLine++;
                gridRow++;
            }
            if (pointerFromTo === "from") {
                messageDiv.style.gridArea = `${gridLine} / 4 / ${gridRow} / 6`;
                gridLine++;
                gridRow++;
            }
            const textDiv = document.createElement('div');
            textDiv.classList.add('text');
            textDiv.innerHTML = `${(middleman.addhtmlTags.conversationFilter(Log.Message))}`;
            const timestampDiv = document.createElement('div');
            fixedDate = processTimestamp(Log.Timestamp);
            timestampDiv.classList.add('timestamp');
            timestampDiv.textContent = `${fixedDate.timeShowOffset} ${fixedDate.timeZone}`;

            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.classList.add(Log.From === middleman.simOwner.number() ? 'from' : 'to');
            numberDiv.textContent += (Log.From === middleman.simOwner.number() ? '✉️ from' : '✉️ from');
            numberDiv.textContent += "\n";
            numberDiv.textContent += ((Log.From_Name));

            messageDiv.appendChild(numberDiv);
            messageDiv.appendChild(textDiv);
            // messageDiv.appendChild(phonebookDiv);
            messageDiv.appendChild(timestampDiv);
            commOutput.appendChild(messageDiv);
        }
    });
}