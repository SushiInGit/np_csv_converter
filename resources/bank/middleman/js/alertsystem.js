var middleman = middleman ?? {};
middleman.alertCooldowns = new Map();

middleman.alertsystem = function (type, message, duration) {

    const currentTime = Date.now();

    // Check if the message is already in the cooldown period
    if (middleman.alertCooldowns.has(message)) {
        const lastTriggeredTime = middleman.alertCooldowns.get(message);
        if (currentTime - lastTriggeredTime < 1000) {
            return;
        }
    }

    middleman.alertCooldowns.set(message, currentTime);

    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');

    alert.classList.add('alert');
    if (type === 'error') {
        alert.classList.add('alert-error');
        alert.innerHTML = `<span class="svg">error_outline</span> ${message}`;
    } else if (type === 'warning') {
        alert.classList.add('alert-warning');
        alert.innerHTML = `<span class="svg">warning_amber</span> ${message}`;
    } else if (type === 'success') {
        alert.classList.add('alert-success');
        alert.innerHTML = `<span class="svg">check_circle_outline</span> ${message}`;
    } else if (type === 'info') {
        alert.classList.add('alert-info');
        alert.innerHTML = `<span class="svg">info_outline</span> ${message}`;
    }

    const countdownBar = document.createElement('div');
    countdownBar.classList.add('countdown-bar');
    alert.appendChild(countdownBar);

    alertContainer.appendChild(alert);

    setTimeout(() => {
        countdownBar.style.width = '0%';
    }, 50);

    countdownBar.style.transitionDuration = `${duration}s`;

    let remainingTime = duration * 1000;
    const interval = 100;

    const countdownTimer = setInterval(() => {
        remainingTime -= interval;
        if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            alert.style.animation = 'slide-out 0.5s ease';
            alert.addEventListener('animationend', () => alert.remove());
        }
    }, interval);

    alert.addEventListener('click', () => {
        clearInterval(countdownTimer);
        remainingTime = 100;
        countdownBar.style.transitionDuration = '0.1s';
        countdownBar.style.width = '0%';
        setTimeout(() => {
            alert.style.animation = 'slide-out 0.5s ease';
            alert.addEventListener('animationend', () => alert.remove());
        }, 100);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const allAlerts = document.querySelectorAll('.alert');
            allAlerts.forEach((toast) => {
                toast.style.animation = 'slide-out 0.5s ease';
                toast.addEventListener('animationend', () => toast.remove());
            });
        }
    });
};

