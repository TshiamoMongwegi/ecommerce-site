// Update navigation based on authentication status
function updateNavigation() {
    const currentUser = userSystem.getCurrentUser();
    const profileLink = document.getElementById('profileLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.querySelector('a[href="register.html"]');

    if (currentUser) {
        // User is logged in
        if (profileLink) {
            profileLink.style.display = 'block';
            profileLink.href = 'profile.html';
        }
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (registerLink) {
            registerLink.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (profileLink) {
            profileLink.style.display = 'none';
        }
        if (loginLink) {
            loginLink.style.display = 'block';
            loginLink.href = 'login.html';
        }
        if (registerLink) {
            registerLink.style.display = 'block';
        }
    }
}

// Check if current page requires authentication
function checkAuthRequired() {
    const currentPage = window.location.pathname.split('/').pop();
    const authRequiredPages = ['profile.html'];
    
    if (authRequiredPages.includes(currentPage)) {
        const currentUser = userSystem.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize auth-related UI
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    checkAuthRequired();
}); 