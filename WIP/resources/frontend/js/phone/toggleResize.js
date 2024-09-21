let isAnimating = false;

function toggleLeft() {
    if (isAnimating) return;

    const commBox = document.getElementById('leftBox');
    const dynGrid = document.getElementById('dynGrid');
    const leftToggle = document.getElementById('toggleleft');
    const mobileToggle = document.getElementById('mobileToggle');
    isAnimating = true;

    if (commBox.classList.contains('hidden')) {
        commBox.style.opacity = 1;
        setTimeout(() => {
            leftToggle.classList.remove('hidden');
            mobileToggle.classList.add('hidden');
            commBox.classList.remove('hidden');
            dynGrid.style.gridTemplateColumns = '340px 1fr';

            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 10);

    } else {
        leftToggle.classList.add('hidden');
        mobileToggle.classList.remove('hidden');
        commBox.classList.add('hidden');
        dynGrid.style.gridTemplateColumns = '0 1fr';
        setTimeout(() => {
            commBox.style.opacity = 0;
            isAnimating = false;
        }, 500);
    }
}


window.addEventListener('resize', function () {
    const commBox = document.getElementById('leftBox');
    const dynGrid = document.getElementById('dynGrid');
    const leftToggle = document.getElementById('toggleleft');
    const mobileToggle = document.getElementById('mobileToggle');

    if (window.innerWidth > 800) {
        commBox.style.opacity = 1;
        leftToggle.classList.remove('hidden');
        mobileToggle.classList.add('hidden');
        commBox.classList.remove('hidden');
        dynGrid.style.gridTemplateColumns = '340px 1fr';

    } else {
        
        if (!commBox.classList.contains('hidden')) {
            commBox.classList.add('hidden');
            dynGrid.style.gridTemplateColumns = '0 1fr';

            setTimeout(() => {
                commBox.style.opacity = 1;
                leftToggle.classList.add('hidden');
                mobileToggle.classList.remove('hidden');
            }, 500);
        }
    }
});