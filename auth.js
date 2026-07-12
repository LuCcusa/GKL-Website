// sign up

async function handleSignUp() {
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

    const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email: email.value.trim(),
        password: pass1.value,
        options: {
            emailRedirectTo: 'https://luccusa.github.io/GKL-Website/success.html',
            data: {
                username: username.value.trim(),
                first_name: firstName.value.trim()
            }
        }
    });

    if (signUpError) {
        error.textContent = signUpError.message;
        error.style.visibility = 'visible';
        clearTimeout(window._tosErrorTimer);
        window._tosErrorTimer = setTimeout(() => {
            error.style.visibility = 'hidden';
        }, 10000);
        return;
    }

    openConfirmOverlay();
}

// sign in

async function handleSignIn() {
    const username = document.getElementById('signinUsername');
    const password = document.getElementById('signinPass');
    const error = document.getElementById('signin-error');

    let message = '';

    if (!username.value.trim()) {
        message = 'Please enter your username.';
    } else if (!password.value.trim()) {
        message = 'Please enter your password.';
    }

    if (message) {
        error.textContent = message;
        error.style.visibility = 'visible';
        return;
    }

    error.style.visibility = 'hidden';

    const { data: email, error: lookupError } = await supabaseClient
        .rpc('get_email_by_username', { lookup_username: username.value.trim() });

    if (lookupError || !email) {
        error.textContent = 'Incorrect username or password.';
        error.style.visibility = 'visible';
        return;
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password.value
    });

    if (signInError) {
        error.textContent = 'Incorrect username or password.';
        error.style.visibility = 'visible';
        return;
    }

    closeSigninOverlay();
    window.location.href = 'accpage.html';
}

// session check for protected pages

async function requireLogin() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
    }
}

// logout

async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}