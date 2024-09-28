var frontend = frontend ?? {};

frontend.showalert = function (type, message, duration) {

    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    
    alert.classList.add('alert');
    if (type === 'error') {
      alert.classList.add('alert-error');
      alert.innerHTML = `<span class="material-icons-outlined">error_outline</span> ${message}`;
    } else if (type === 'warning') {
      alert.classList.add('alert-warning');
      alert.innerHTML = `<span class="material-icons-outlined">warning_amber</span> ${message}`;
    } else if (type === 'success') {
      alert.classList.add('alert-success');
      alert.innerHTML = `<span class="material-icons-outlined">check_circle_outline</span> ${message}`;
    } else if (type === 'info') {
      alert.classList.add('alert-info');
      alert.innerHTML = `<span class="material-icons-outlined">info_outline</span> ${message}`;
    }


    const countdownBar = document.createElement('div');
    countdownBar.classList.add('countdown-bar');
    alert.appendChild(countdownBar);

    
    alertContainer.appendChild(alert);

    
    setTimeout(() => {
      countdownBar.style.width = '0%';
    }, 50);  

    countdownBar.style.transitionDuration = `${duration}s`;

    setTimeout(() => {
      alert.style.animation = 'slide-out 0.5s ease';
      alert.addEventListener('animationend', () => alert.remove());
    }, duration * 1000);
  }


// Capture Error from Console.log 
  window.onerror = function(message, source, lineno, colno, error) {
    if (message.startsWith("Uncaught Error: ")) {
      frontend.showalert('error',`${message}.`, 7);
    } else if (message.startsWith("Uncaught TypeError: Cannot read properties of undefined")) {
      frontend.showalert('error',`Error: This File is not a spreadsheet or corrupted.`, 7);
    }  else if (message.startsWith("localStorage.bankRecords.Empty")) {
      frontend.showalert('info',`It seems that you have not uploaded an XLSX file.`, 7);
    }
    //return true;  //silence errors on active
};



  /*
  frontend.showalert('info','blubb iam a info', 15);
  frontend.showalert('success','miau yes success', 15);
  frontend.showalert('warning','chirp warning chirp', 15);
  frontend.showalert('error','404', 15);
  frontend.showalert('info','blubb again', 15);
  */