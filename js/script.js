// TimeZone E-commerce Website JavaScript
// All interactive functionality in a single file

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let countdownInterval;

// Product data
const products = {
    'mens-chronograph': {
        name: 'Classic Men\'s Chronograph',
        price: 499.99,
        image: '../images/watch_mens_stylish.jpg',
        description: 'Sophisticated chronograph with stainless steel case and leather strap.'
    },
    'womens-mesh': {
        name: 'Elegant Women\'s Mesh Watch',
        price: 189.99,
        image: '../images/watch_womens_elegant.jpg',
        description: 'Timeless elegance with rose gold mesh strap and minimalist design.'
    },
    'womens-gold': {
        name: 'Vintage Gold Collection',
        price: 329.99,
        image: '../images/watch_womens_gold.jpg',
        description: 'Exquisite gold-toned vintage design with intricate link bracelet.'
    },
    'executive-chronograph': {
        name: 'Executive Chronograph',
        price: 749.99,
        image: '../images/watch_luxury_men.jpg',
        description: 'Premium stainless steel chronograph with sapphire crystal.'
    },
    'sport-pro': {
        name: 'Sport Pro Series',
        price: 399.99,
        image: '../images/watch_luxury_men.jpg',
        description: 'Durable sports watch with titanium case and rubber strap.'
    },
    'classic-leather': {
        name: 'Classic Leather Collection',
        price: 249.99,
        image: '../images/watch_womens_elegant.jpg',
        description: 'Timeless design with genuine leather strap and silver-toned case.'
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    setupProductFilters();
    setupProductDetails();
    setupCartFunctionality();
    setupFormValidation();
    setupCountdownTimer();
    setupPasswordToggles();
    updateCartDisplay();
    
    // Page-specific initializations
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = '#fff';
                navbar.style.backdropFilter = 'none';
            }
        }
    });
}

// Scroll effects for animations
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.product-card, .testimonial, .value-item, .team-member, .benefit-item, .faq-item').forEach(el => {
        el.classList.add('scroll-fade');
        observer.observe(el);
    });
}

// Product filtering functionality
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || (categories && categories.includes(filter))) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Product details toggle functionality
function setupProductDetails() {
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const details = productCard.querySelector('.product-details');
            
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                this.textContent = 'Hide Details';
                details.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                details.style.display = 'none';
                this.textContent = 'View Details';
            }
        });
    });
}

// Cart functionality
function setupCartFunctionality() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            addToCart(productId);
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#27ae60';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                displayCartItems();
            }
        });
    }
    
    // Promo code functionality
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Checkout functionality would be implemented here. Thank you for shopping with TimeZone!');
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Update cart count display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Display cart items on cart page
function displayCartItems() {
    const emptyCart = document.getElementById('empty-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemsList = document.getElementById('cart-items-list');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        cartItemsList.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = createCartItemElement(item, index);
            cartItemsList.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
        <div class="cart-item-product">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="setQuantity(${index}, this.value)">
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="remove-item" onclick="removeFromCart(${index})" title="Remove item">×</button>
    `;
    
    return cartItem;
}

// Update item quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        displayCartItems();
    }
}

// Set specific quantity
function setQuantity(index, quantity) {
    const qty = parseInt(quantity);
    if (cart[index] && qty > 0) {
        cart[index].quantity = qty;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        displayCartItems();
    }
}

// Remove item from cart
function removeFromCart(index) {
    if (confirm('Remove this item from your cart?')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        displayCartItems();
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    if (!subtotalElement) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Promo code functionality
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    
    if (!promoInput || !promoMessage) return;
    
    const code = promoInput.value.trim().toUpperCase();
    const validCodes = {
        'WELCOME10': 0.10,
        'SAVE20': 0.20,
        'TIMEZONE15': 0.15
    };
    
    if (validCodes[code]) {
        promoMessage.textContent = `Promo code applied! ${(validCodes[code] * 100)}% discount`;
        promoMessage.className = 'promo-message success';
        
        // Apply discount (simplified - would need more complex logic for real implementation)
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            const currentTotal = parseFloat(totalElement.textContent.replace('$', ''));
            const discountedTotal = currentTotal * (1 - validCodes[code]);
            totalElement.textContent = `$${discountedTotal.toFixed(2)}`;
        }
    } else {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'promo-message error';
    }
}

// Form validation functionality
function setupFormValidation() {
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
            }
        });
    }
    
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                showSuccessMessage('Login successful! Welcome back.');
                // In a real app, this would redirect or update the UI
            }
        });
    }
    
    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSignupForm()) {
                showSuccessMessage('Account created successfully! Welcome to TimeZone.');
                // In a real app, this would redirect or update the UI
            }
        });
        
        // Real-time password validation
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', validatePasswordRequirements);
        }
    }
}

// Validate contact form
function validateContactForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!name.value.trim()) {
        showFieldError(name, nameError, 'Name is required');
        isValid = false;
    } else {
        clearFieldError(name, nameError);
    }
    
    // Email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    if (!email.value.trim()) {
        showFieldError(email, emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError(email, emailError);
    }
    
    // Subject validation
    const subject = document.getElementById('subject');
    const subjectError = document.getElementById('subject-error');
    if (!subject.value) {
        showFieldError(subject, subjectError, 'Please select a subject');
        isValid = false;
    } else {
        clearFieldError(subject, subjectError);
    }
    
    // Message validation
    const message = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (!message.value.trim()) {
        showFieldError(message, messageError, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, messageError, 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        clearFieldError(message, messageError);
    }
    
    return isValid;
}

// Validate login form
function validateLoginForm() {
    let isValid = true;
    
    // Email validation
    const email = document.getElementById('login-email');
    const emailError = document.getElementById('login-email-error');
    if (!email.value.trim()) {
        showFieldError(email, emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError(email, emailError);
    }
    
    // Password validation
    const password = document.getElementById('login-password');
    const passwordError = document.getElementById('login-password-error');
    if (!password.value) {
        showFieldError(password, passwordError, 'Password is required');
        isValid = false;
    } else {
        clearFieldError(password, passwordError);
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm() {
    let isValid = true;
    
    // First name validation
    const firstName = document.getElementById('first-name');
    const firstNameError = document.getElementById('first-name-error');
    if (!firstName.value.trim()) {
        showFieldError(firstName, firstNameError, 'First name is required');
        isValid = false;
    } else {
        clearFieldError(firstName, firstNameError);
    }
    
    // Last name validation
    const lastName = document.getElementById('last-name');
    const lastNameError = document.getElementById('last-name-error');
    if (!lastName.value.trim()) {
        showFieldError(lastName, lastNameError, 'Last name is required');
        isValid = false;
    } else {
        clearFieldError(lastName, lastNameError);
    }
    
    // Email validation
    const email = document.getElementById('signup-email');
    const emailError = document.getElementById('signup-email-error');
    if (!email.value.trim()) {
        showFieldError(email, emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError(email, emailError);
    }
    
    // Password validation
    const password = document.getElementById('signup-password');
    const passwordError = document.getElementById('signup-password-error');
    if (!password.value) {
        showFieldError(password, passwordError, 'Password is required');
        isValid = false;
    } else if (!isValidPassword(password.value)) {
        showFieldError(password, passwordError, 'Password does not meet requirements');
        isValid = false;
    } else {
        clearFieldError(password, passwordError);
    }
    
    // Confirm password validation
    const confirmPassword = document.getElementById('confirm-password');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    if (!confirmPassword.value) {
        showFieldError(confirmPassword, confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, confirmPasswordError, 'Passwords do not match');
        isValid = false;
    } else {
        clearFieldError(confirmPassword, confirmPasswordError);
    }
    
    // Terms agreement validation
    const terms = document.getElementById('terms-agreement');
    const termsError = document.getElementById('terms-agreement-error');
    if (!terms.checked) {
        showFieldError(terms, termsError, 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        clearFieldError(terms, termsError);
    }
    
    return isValid;
}

// Password requirements validation
function validatePasswordRequirements() {
    const password = document.getElementById('signup-password').value;
    
    const requirements = {
        'length-req': password.length >= 8,
        'uppercase-req': /[A-Z]/.test(password),
        'lowercase-req': /[a-z]/.test(password),
        'number-req': /\d/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            if (requirements[reqId]) {
                element.classList.add('valid');
                element.classList.remove('invalid');
            } else {
                element.classList.add('invalid');
                element.classList.remove('valid');
            }
        }
    });
}

// Utility functions for validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
}

function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(field, errorElement) {
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function showSuccessMessage(message) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Password toggle functionality
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const showText = this.querySelector('.show-text');
            const hideText = this.querySelector('.hide-text');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                showText.style.display = 'none';
                hideText.style.display = 'inline';
            } else {
                passwordInput.type = 'password';
                showText.style.display = 'inline';
                hideText.style.display = 'none';
            }
        });
    });
}

// Countdown timer functionality
function setupCountdownTimer() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    // Set countdown end date (7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = '<h3>Offer Expired!</h3>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Color change effects on scroll
function setupColorChangeEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Change header background color based on scroll
        const header = document.querySelector('.navbar');
        if (header) {
            const opacity = Math.min(scrolled / 100, 1);
            header.style.backgroundColor = `rgba(255, 255, 255, ${0.9 + opacity * 0.1})`;
        }
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero-image img');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize color change effects
setupColorChangeEffects();

// Add CSS animations for success messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .password-requirements li.valid::before {
        content: '✓ ';
        color: #27ae60;
        font-weight: bold;
    }
    
    .password-requirements li.invalid::before {
        content: '✗ ';
        color: #e74c3c;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Export functions for global access (for onclick handlers in HTML)
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
window.removeFromCart = removeFromCart;

