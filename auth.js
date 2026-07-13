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

// show/hide account icon based on login state

async function checkLoginState() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const accountLink = document.getElementById('accountIconLink');
    const signinBtn = document.querySelector('.signin-btn');

    if (session) {
        if (accountLink) accountLink.style.display = '';
        if (signinBtn) signinBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', checkLoginState);

// load profile data into account page

async function loadProfileData() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('username, first_name, created_at')
        .eq('id', session.user.id)
        .single();

    if (error || !profile) return;

    const nameEl = document.querySelector('.profile-name');
    const usernameEl = document.querySelector('.current-username-value');
    const createdEl = document.getElementById('accountCreatedDate');

    if (nameEl) nameEl.textContent = profile.first_name;
    if (usernameEl) usernameEl.textContent = profile.username;
    if (createdEl) {
        const date = new Date(profile.created_at);
        createdEl.textContent = date.toLocaleDateString();
    }
}

document.addEventListener('DOMContentLoaded', loadProfileData);

// Username Change

function openUsernameChangeOverlay() {
    document.getElementById('usernameChangeBackdrop').classList.add('active');
}

function closeUsernameChangeOverlay() {
    document.getElementById('usernameChangeBackdrop').classList.remove('active');
    document.getElementById('newUsernameInput').value = '';
    document.getElementById('username-change-error').style.visibility = 'hidden';
}

async function handleUsernameChange() {
    const input = document.getElementById('newUsernameInput');
    const error = document.getElementById('username-change-error');
    const newUsername = input.value.trim();

    if (!newUsername) {
        error.textContent = 'Please enter a username.';
        error.style.visibility = 'visible';
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', session.user.id);

    if (updateError) {
        if (updateError.code === '23505') {
            error.textContent = 'This username is already taken.';
        } else {
            error.textContent = 'Something went wrong. Please try again.';
        }
        error.style.visibility = 'visible';
        return;
    }

    error.style.visibility = 'hidden';
    document.querySelector('.current-username-value').textContent = newUsername;
    closeUsernameChangeOverlay();
}

function closeUsernameChangeOnBackdrop(e) {
    if (e.target === document.getElementById('usernameChangeBackdrop')) {
        closeUsernameChangeOverlay();
    }
}

// change password

async function handlePasswordChange() {
    const pass1 = document.getElementById('newpass1');
    const pass2 = document.getElementById('newpass2');
    const error = document.getElementById('passchange-error');

    function showError(msg) {
        error.textContent = msg;
        error.style.visibility = 'visible';
        clearTimeout(window._passchangeErrorTimer);
        window._passchangeErrorTimer = setTimeout(() => {
            error.style.visibility = 'hidden';
        }, 10000);
        pass1.value = '';
        pass2.value = '';
    }

    if (!pass1.value.trim() || !pass2.value.trim()) {
        showError('Please fill out both fields.');
        return;
    }

    if (pass1.value !== pass2.value) {
        showError('Passwords do not match.');
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('password_changed_at')
        .eq('id', session.user.id)
        .single();

    if (profileError) {
        showError('Something went wrong. Please try again.');
        return;
    }

    if (profile.password_changed_at) {
        const lastChanged = new Date(profile.password_changed_at);
        const now = new Date();
        const hoursSince = (now - lastChanged) / (1000 * 60 * 60);

        if (hoursSince < 1) {
            showError('Password has recently been changed. Please try again later.');
            return;
        }
    }

    const { error: sameCheckError } = await supabaseClient.auth.signInWithPassword({
        email: session.user.email,
        password: pass1.value
    });

    if (!sameCheckError) {
        showError("New password can't match your current password.");
        return;
    }

    const { error: updateError } = await supabaseClient.auth.updateUser({
        password: pass1.value
    });

    if (updateError) {
        showError('Something went wrong. Please try again.');
        return;
    }

    await supabaseClient
        .from('profiles')
        .update({ password_changed_at: new Date().toISOString() })
        .eq('id', session.user.id);

    error.style.visibility = 'hidden';
    pass1.value = '';
    pass2.value = '';
    closePasschangeOverlay();
}

// reset password request

async function handlePasswordResetRequest() {
    const username = document.getElementById('resetUsername');
    const error = document.getElementById('reset-error');

    if (!username.value.trim()) {
        error.textContent = 'Please enter your username.';
        error.style.visibility = 'visible';
        return;
    }

    const { data: email, error: lookupError } = await supabaseClient
        .rpc('get_email_by_username', { lookup_username: username.value.trim() });

    if (lookupError || !email) {
        error.textContent = 'No account found with that username.';
        error.style.visibility = 'visible';
        return;
    }

    const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://luccusa.github.io/GKL-Website/forgotpass.html'
    });

    if (resetError) {
        error.textContent = 'Something went wrong. Please try again.';
        error.style.visibility = 'visible';
        return;
    }

    error.style.visibility = 'hidden';
    username.value = '';
    openConfirmOverlay();
}