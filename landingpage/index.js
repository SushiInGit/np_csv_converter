function createClick() {
    const elementPhone = document.getElementById('phone');
    elementPhone.style.cursor = "pointer";
    elementPhone.addEventListener('click', () => redirect('phone'));
    const elementBank = document.getElementById('bank');
    elementBank.style.cursor = "pointer";
    elementBank.addEventListener('click', () => redirect('bank'));
}

function redirect(click) {
    if (click === 'phone') {
        window.location.href = "phone.html";
    }
    if (click === 'bank') {
        alert("Function: Bank Subpoena is WIP.\nComming soon (tm)...");
        window.location.href = "";
    }
}
createClick();

/////// RND FUN BULLSHIT *smilie*

function updateTime() {
    const timeElement = document.getElementById("user-time");
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    const userLocale = navigator.language;
    const formattedTime = now.toLocaleTimeString(userLocale, options);
    timeElement.innerHTML = formattedTime;
}

function changeIcons() {
    const iconElement = document.getElementById("icon");
    const wifiOptions = ['wifi', 'wifi_1_bar', 'wifi_2_bar'];
    const batteryOptions = ['battery_full_alt', 'battery_6_bar', 'battery_5_bar', 'battery_4_bar', 'battery_3_bar', 'battery_2_bar'];

    const randomWifi = wifiOptions[Math.floor(Math.random() * wifiOptions.length)];
    const randomBattery = batteryOptions[Math.floor(Math.random() * batteryOptions.length)];

    iconElement.innerHTML = `vibration ${randomWifi} ${randomBattery}`;
    const randomInterval = Math.floor(Math.random() * 5000) + 1000;
    setTimeout(changeIcons, randomInterval);
}

changeIcons();
updateTime();
setInterval(updateTime, 1000);



/*
"Sorry, I was bored and just wanted to mess around a bit... these functions have zero purpose or value, but hey, 'just for the lulz' xD"
by Sushi
*/