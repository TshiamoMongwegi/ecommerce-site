// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// User Management System
const userSystem = {
    // Initialize users array in localStorage if not exists
    init: function() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    },

    // Register a new user
    register: function(userData) {
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if email already exists
        if (users.some(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }

        // Add new user
        users.push({
            ...userData,
            id: Date.now().toString(), // Simple unique ID
            dateRegistered: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },

    // Login user
    login: function(email, password) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user info (excluding password)
            const { password, ...userInfo } = user;
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
            return userInfo;
        }
        return null;
    },

    // Logout user
    logout: function() {
        localStorage.removeItem('currentUser');
    },

    // Get current user
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return !!localStorage.getItem('currentUser');
    },

    // Update user profile
    updateProfile: function(userId, updates) {
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user if it's the logged in user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const { password, ...userInfo } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
        }

        return true;
    }
};

// Initialize user system
userSystem.init();

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Cursor effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
        cursorFollower.style.borderColor = 'var(--primary-color)';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.borderColor = 'var(--primary-color)';
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navToggle.classList.toggle('active');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero-section');
const floatingElements = document.querySelectorAll('.floating-item');

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    floatingElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Dynamic product loading
const productGrid = document.querySelector('.product-grid');
const products = [
    {
        name: 'Cool Sneakers',
        price: ' 1200',
        image: 'images/Nike White AF1 - Ecommerce.avif',
        category: 'Footwear',
        link: 'Categories.html#Footwear'
    },
    {
        name: 'Luxury Watch',
        price: ' 4500',
        image: 'images/Watch Ecommerce.webp',
        category: 'Watches',
        link: 'Categories.html#Watches'
    },
    {
        name: 'Headphones',
        price: ' 99',
        image: 'images/Apple head phones - Ecommerce.jpg',
        category: 'Electronics',
        link: 'Categories.html#Electronics'
    },
    {
        name: 'Luxury Bags',
        price: ' 600',
        image: 'images/hermes duffel v2.webp',
        category: 'Bags',
        link: 'bags.html'
    },
    {
        name: 'Tops',
        price: ' 400',
        image: 'images/Tee shirts - ecommerce.avif',
        category: 'Clothing',
        link: 'Categories.html#Clothing'
    }
];

function createProductCard(product) {
    return `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="price">BWP ${product.price}</p>
                <a href="${product.link}" class="btn secondary-btn" style="margin-top: 0.5rem;">See More</a>
            </div>
        </div>
    `;
}

// Load products with category filtering
if (productGrid) {
    // Get current page name without extension
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Get category from URL hash if present
    const categoryFromHash = window.location.hash.replace('#', '');
    
    // Map page names to categories
    const pageToCategory = {
        'watches': 'Watches',
        'electronics': 'Electronics',
        'tops': 'Clothing',
        'Pula Store Sneakers page': 'Footwear',
        'Categories': categoryFromHash || null // Use hash category if on Categories page
    };
    
    // Filter products based on current page or hash
    let filteredProducts = products;
    if (pageToCategory[currentPage]) {
        filteredProducts = products.filter(product => product.category === pageToCategory[currentPage]);
    } else if (currentPage === 'index') {
        // On homepage, show all products
        filteredProducts = products;
    }
    
    // Display filtered products
    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Load cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add notification toast HTML to the page if not present
if (!document.querySelector('.cart-toast')) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
      <span class="toast-message">Product added to cart!</span>
      <button class="toast-btn open-cart">Open Cart</button>
      <button class="toast-btn continue-shopping">Continue Shopping</button>
    `;
    document.body.appendChild(toast);
}

// Utility to update cart count in nav
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }
}

// Call on page load
updateCartCount();

// Add to cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;

        cart.push({ name: productName, price: productPrice, image: productImage });
        localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage

        updateCartCount(); // Update cart count in nav

        // Add animation
        const cartCount = document.querySelector('.cart-count');
        cartCount.style.animation = 'none';
        cartCount.offsetHeight; // Trigger reflow
        cartCount.style.animation = 'bounce 0.5s';
        
        // Show custom toast notification
        const toast = document.querySelector('.cart-toast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    // Handle toast button actions
    if (e.target.classList.contains('open-cart')) {
        window.location.href = 'cart.html';
    }
    if (e.target.classList.contains('continue-shopping')) {
        document.querySelector('.cart-toast').classList.remove('show');
    }
});

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map((item, idx) => `
                <div class="cart-item" data-index="${idx}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                        <button class="cart-btn pay-btn">Pay</button>
                        <button class="cart-btn remove-btn">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Call displayCartItems when the cart page loads
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}

// Remove from cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const cartItem = e.target.closest('.cart-item');
        const idx = parseInt(cartItem.getAttribute('data-index'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount(); // Update cart count in nav
    }
    if (e.target.classList.contains('pay-btn')) {
        window.location.href = 'payment.html';
    }
});

// Add CSS animation for cart count
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style); 