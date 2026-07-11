// built by us carousel

const wrap = document.querySelector('.carousel-wrap');
const track = document.querySelector('.carousel-track');

if (wrap && track) {
    const origItems = Array.from(track.querySelectorAll('.build-item'));
    const origCount = origItems.length;

    for (let set = 0; set < 2; set++) {
        origItems.forEach(item => track.appendChild(item.cloneNode(true)));
    }

    let currentIndex = origCount;
    let isAnimating = false;

    function getSlideWidth() {
        return track.querySelector('.build-item').offsetWidth + 10;
    }

    function setPosition(animate) {
        track.style.transition = animate ? 'transform 0.3s ease' : 'none';
        track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
    }

    setTimeout(() => setPosition(false), 50);

    function move(dir) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex += dir;
        setPosition(true);

        setTimeout(() => {
            if (currentIndex >= origCount * 2) {
                currentIndex = origCount;
                setPosition(false);
            }
            if (currentIndex < origCount) {
                currentIndex = origCount * 2 - 1;
                setPosition(false);
            }
            isAnimating = false;
        }, 310);
    }

    wrap.addEventListener('wheel', (e) => {
        e.preventDefault();
        move(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; });
    wrap.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 30) move(diff > 0 ? 1 : -1);
    });

    track.addEventListener('click', (e) => {
        const item = e.target.closest('.build-item');
        if (!item) return;
        const img = item.querySelector('img');
        const alt = img?.alt || '';
        const altMap = {
            'Build 1': 'blurple',
            'Build 2': 'orange',
            'Build 3': 'red',
            'Build 4': 'rgb',
            'Build 5': 'cyan'
        };
        const key = altMap[alt];
        if (key) openBuildOverlay(key);
    });
}

// registration form

function togglePass(id, icon) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
        icon.src = 'assets/eye-on.png';
    } else {
        input.type = 'password';
        icon.src = 'assets/eye-off.png';
    }
}

// checkbox

let isChecked = false;

function toggleCheckbox(img) {
    isChecked = !isChecked;
    img.src = isChecked ? 'assets/Checked.png' : 'assets/Unchecked.png';
}

// sign up validation

function handleSignUp() {
    const username = document.querySelector('input[placeholder="Enter username..."]');
    const firstName = document.querySelector('input[placeholder="Enter First Name..."]');
    const pass1 = document.getElementById('pass1');
    const pass2 = document.getElementById('pass2');
    const email = document.querySelector('input[type="email"]');
    const error = document.getElementById('tos-error');

    let message = '';

    if (!username.value.trim()) {
        message = 'Please enter a username.';
    } else if (!firstName.value.trim()) {
        message = 'Please enter your first name.';
    } else if (!pass1.value.trim()) {
        message = 'Please enter a password.';
    } else if (!pass2.value.trim()) {
        message = 'Please repeat your password.';
    } else if (pass1.value !== pass2.value) {
        message = 'Passwords do not match.';
    } else if (!email.value.trim()) {
    message = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        message = 'Please enter a valid email address.';
    } else if (!isChecked) {
    } else if (!isChecked) {
        message = 'You must accept the Terms of Service and Privacy Policy to continue.';
    }

    if (message) {
        error.textContent = message;
        error.style.visibility = 'visible';
        clearTimeout(window._tosErrorTimer);
        window._tosErrorTimer = setTimeout(() => {
            error.style.visibility = 'hidden';
        }, 10000);
        return;
    }

    error.style.visibility = 'hidden';
}

// menu overlay

function openOverlay() {
    document.getElementById('menuOverlay').classList.add('active');
}

function closeOverlay() {
    document.getElementById('menuOverlay').classList.remove('active');
}

// sign in overlay

function openSigninOverlay() {
    document.getElementById('signinOverlay').parentElement.classList.add('active');
}

function closeSigninOverlay() {
    document.getElementById('signinOverlay').parentElement.classList.remove('active');
}

// acc page overlays

function closeAllOverlays() {
    document.getElementById('profileOverlay').classList.remove('active');
    document.getElementById('passchangeOverlay').classList.remove('active');
    document.getElementById('purchasehistoryOverlay').classList.remove('active');
    document.getElementById('purchasehistoryCloseRow').classList.remove('active');
}

function openProfileOverlay() {
    closeAllOverlays();
    document.getElementById('profileOverlay').classList.add('active');
}

function closeProfileOverlay() {
    document.getElementById('profileOverlay').classList.remove('active');
}

function openPasschangeOverlay() {
    closeAllOverlays();
    document.getElementById('passchangeOverlay').classList.add('active');
}

function closePasschangeOverlay() {
    document.getElementById('passchangeOverlay').classList.remove('active');
}

function openPurchasehistoryOverlay() {
    closeAllOverlays();
    document.getElementById('purchasehistoryOverlay').classList.add('active');
    document.getElementById('purchasehistoryCloseRow').classList.add('active');
}

function closePurchasehistoryOverlay() {
    document.getElementById('purchasehistoryOverlay').classList.remove('active');
    document.getElementById('purchasehistoryCloseRow').classList.remove('active');
}

// build overlay data

const buildData = {
    'blurple': {
        name: 'Blurple',
        img: 'assets/build blurple.png',
        desc: `CPU: Intel Core i9-13900K
GPU: NVIDIA GeForce RTX 4090
RAM: G.Skill Trident Z5 RGB DDR5 32GB (2×16GB) 6000MHz
Storage: Samsung 990 Pro 2TB NVMe M.2
Motherboard: ASUS ROG Maximus Z790 Hero
CPU Cooler: ASUS ROG Ryujin III 360mm AIO
PSU: Seasonic Prime TX-1000W 80+ Titanium
Case: Lian Li O11 Dynamic EVO`
    },
    'orange': {
        name: 'Orange',
        img: 'assets/build orange.png',
        desc: `CPU: Intel Core i7-13700K
GPU: NVIDIA GeForce RTX 3080
RAM: Corsair Vengeance DDR4 32GB (2×16GB) 3600MHz
Storage: Samsung 980 Pro 1TB NVMe M.2
Motherboard: ASUS ROG Strix Z690-F Gaming WiFi
CPU Cooler: Corsair iCUE H150i Elite 360mm AIO
PSU: Corsair RM850x 850W 80+ Gold
Case: Lian Li Lancool 216`
    },
    'red': {
        name: 'Red',
        img: 'assets/build red.png',
        desc: `CPU: AMD Ryzen 9 7950X3D (16-core, 32-thread, up to 5.7GHz)
GPU: ASUS TUF Gaming RTX 5090 OC 32GB GDDR7
RAM: 64GB (2×32GB) DDR5-6000
Storage: 4TB WD Black SN850X NVMe SSD
Motherboard: ASUS ROG Strix X870E-E Gaming Wi-Fi
CPU Cooler: ASUS ROG Ryujin III 360mm Liquid Cooler
PSU: ASUS ROG Thor 1600W 80 Plus Titanium
Case: Lian Li O11 Dynamic EVO RGB`
    },
    'rgb': {
        name: 'RGB',
        img: 'assets/build rgb.png',
        desc: `CPU: 
GPU: 
RAM: 
Storage: 
Motherboard: 
CPU Cooler: 
PSU: 
Case: `
    },
    'cyan': {
        name: 'Cyan',
        img: 'assets/build cyan.png',
        desc: `CPU: 
GPU: 
RAM: 
Storage: 
Motherboard: 
CPU Cooler: 
PSU: 
Case: `
    }
};

function openBuildOverlay(key) {
    const data = buildData[key];
    if (!data) return;
    document.getElementById('buildOverlayTitle').textContent = data.name;
    document.getElementById('buildOverlayImg').src = data.img;
    document.getElementById('buildOverlayDesc').innerHTML = data.desc
        .split('\n')
        .filter(l => l.trim())
        .map(l => `<p style="margin:0 0 4px;">${l}</p>`)
        .join('');
    document.getElementById('buildOverlayBorder').classList.add('active');
}

function closeBuildOverlay(e) {
    if (e && e.target !== document.getElementById('buildOverlayBorder')) return;
    document.getElementById('buildOverlayBorder').classList.remove('active');
}