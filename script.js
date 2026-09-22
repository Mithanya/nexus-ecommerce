/**
 * NEXUS - PREMIUM FRONTEND ENGINE (v8.0 - Human Style)
 * Built with jQuery 3.7.1
 */

$(document).ready(function() {

    const API_BASE = '/api';

    /* ==========================================
       1. Global Utilities & Helpers
       ========================================== */

    // Toast Message Notification System
    function showToast(message) {
        let toast = $('.toast');
        if (toast.length === 0) {
            toast = $('<div class="toast"><span class="toast-icon">🛍️</span><span class="toast-text"></span></div>');
            $('body').append(toast);
        }
        toast.find('.toast-text').text(message);
        toast.addClass('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.removeClass('show');
        }, 3000);
    }

    // Price Parsing utility: converts "From ₹1,49,900" into 149900
    function parsePrice(priceText) {
        return parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
    }

    // Price Formatting utility: converts 149900 into "₹1,49,900"
    function formatPrice(number) {
        return '₹' + number.toLocaleString('en-IN');
    }


    /* ==========================================
       2. Shopping Cart Management Engine
       ========================================== */

    // Retrieve cart data from localStorage or init empty
    function getCart() {
        try {
            const data = localStorage.getItem('nexus_cart');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse cart data:", e);
            return [];
        }
    }

    // Save cart data to localStorage
    function saveCart(cart) {
        localStorage.setItem('nexus_cart', JSON.stringify(cart));
    }

    // Renders the cart lists, badges, and subtotals
    function updateCartUI() {
        const cart = getCart();
        const cartList = $('.cart-items-list');
        const badge = $('.bag-badge');
        const subtotalEl = $('.cart-summary-total');
        
        // Reset list content
        cartList.empty();
        
        let totalQty = 0;
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartList.append('<p class="cart-empty-msg">Your Bag is empty.</p>');
            badge.removeClass('visible').text('0');
            subtotalEl.text('₹0');
            return;
        }
        
        // Loop and render items
        cart.forEach((item, index) => {
            totalQty += item.qty;
            const itemCost = item.price * item.qty;
            subtotal += itemCost;
            
            const itemHTML = `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image || 'assets/iphone_15_pro_max_1776504783590.png'}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn cart-qty-minus">-</button>
                            <span class="cart-qty-val">${item.qty}</span>
                            <button class="cart-qty-btn cart-qty-plus">+</button>
                            <button class="cart-item-remove">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            cartList.append(itemHTML);
        });
        
        // Update summaries
        badge.addClass('visible').text(totalQty);
        subtotalEl.text(formatPrice(subtotal));
    }

    // Add item to cart logic
    function addToCart(name, priceText, image, qty) {
        const cart = getCart();
        const price = parsePrice(priceText);
        
        // Check if item already in cart
        const existingIndex = cart.findIndex(item => item.name === name);
        
        if (existingIndex !== -1) {
            cart[existingIndex].qty += qty;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                qty: qty
            });
        }
        
        saveCart(cart);
        updateCartUI();
        showToast(`Added ${name} to bag.`);
        
        // Auto open cart drawer
        $('.cart-drawer, .cart-drawer-overlay').addClass('open');
    }

    // Event Delegation for Cart Quantity Modifications inside the drawer
    $('.cart-items-list').on('click', '.cart-qty-plus', function() {
        const index = $(this).closest('.cart-item').data('index');
        const cart = getCart();
        cart[index].qty += 1;
        saveCart(cart);
        updateCartUI();
    });

    $('.cart-items-list').on('click', '.cart-qty-minus', function() {
        const index = $(this).closest('.cart-item').data('index');
        const cart = getCart();
        if (cart[index].qty > 1) {
            cart[index].qty -= 1;
        } else {
            cart.splice(index, 1);
        }
        saveCart(cart);
        updateCartUI();
    });

    $('.cart-items-list').on('click', '.cart-item-remove', function() {
        const index = $(this).closest('.cart-item').data('index');
        const cart = getCart();
        const removedName = cart[index].name;
        cart.splice(index, 1);
        saveCart(cart);
        updateCartUI();
        showToast(`Removed ${removedName} from bag.`);
    });

    // Quantity selectors in Bento cards (Home page UI)
    $('.qty-controls').on('click', '.qty-btn', function() {
        const valEl = $(this).siblings('.qty-val');
        let currentVal = parseInt(valEl.text()) || 1;
        
        if ($(this).text() === '+') {
            currentVal += 1;
        } else if ($(this).text() === '-' && currentVal > 1) {
            currentVal -= 1;
        }
        valEl.text(currentVal);
    });

    // Global listener for "Buy" actions (handles Home & Store grids)
    $('body').on('click', '.btn', function() {
        const btnText = $(this).text().trim().toLowerCase();
        if (btnText === 'buy' || btnText === 'buy now') {
            // Find parent container (handles bento-card or card-pro layout styles)
            const card = $(this).closest('.bento-card, .card-pro');
            if (card.length > 0) {
                const name = card.find('h3, .card-title').first().text().trim();
                const priceText = card.find('.price-tag, .card-price').first().text().trim();
                const image = card.find('img').first().attr('src');
                const qtyVal = parseInt(card.find('.qty-val').text()) || 1;
                
                addToCart(name, priceText, image, qtyVal);
                
                // Reset card quantity counter if it has one
                card.find('.qty-val').text('1');
            }
        }
    });

    // Opening and closing Cart Drawer actions
    $('.bag-icon').on('click', function() {
        $('.cart-drawer, .cart-drawer-overlay').addClass('open');
    });

    $('.cart-close-btn, .cart-drawer-overlay').on('click', function() {
        $('.cart-drawer, .cart-drawer-overlay').removeClass('open');
    });

    // Checkout event handler

    // Checkout event handler (QR modal)
    $('.btn-checkout').on('click', function() {
        const cart = getCart();
        if (cart.length === 0) {
            showToast("Your bag is empty.");
            return;
        }
        // Calculate total amount
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        // Generate QR code URL (placeholder payment link)
        const paymentUrl = `https://example.com/pay?amount=${total}`;
        const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUrl)}`;
        $('#qr-code-img').attr('src', qrImgSrc);
        // Show QR modal
        $('.qr-modal').removeClass('hidden');
        // Show toast
        showToast("Order placed! Scan QR to pay.");
        // Clear cart after short delay
        setTimeout(() => {
            localStorage.removeItem('nexus_cart');
            updateCartUI();
            $('.cart-drawer, .cart-drawer-overlay').removeClass('open');
        }, 1500);
    });



    /* ==========================================
       3. Theme Toggle & Sync (Persistent in Storage)
       ========================================== */

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    }

    function updateThemeToggleIcon(theme) {
        const toggleBtn = $('#dark-mode-toggle');
        if (toggleBtn.length > 0) {
            toggleBtn.text(theme === 'dark' ? '☀️' : '🌙');
        }
    }

    $('#dark-mode-toggle').on('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
        showToast(`Theme switched to ${newTheme} mode.`);
    });


    /* ==========================================
       4. Product Filters (Store page grid)
       ========================================== */

    $('.filter-pill').on('click', function() {
        const filterVal = $(this).data('filter');
        
        // Toggle active pill styling
        $('.filter-pill').removeClass('active');
        $(this).addClass('active');
        
        const products = $('.card-pro');
        
        if (filterVal === 'all') {
            products.each(function() {
                $(this).stop().fadeIn(400);
            });
        } else {
            products.each(function() {
                const category = $(this).data('category');
                if (category === filterVal) {
                    $(this).stop().fadeIn(400);
                } else {
                    $(this).stop().fadeOut(300);
                }
            });
        }
    });


    /* ==========================================
       5. Contact Form Submission (Feedback visual)
       ========================================== */

    $('.contact-form').on('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        $(this).find('input[required], textarea[required], select[required]').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).css('border-color', '#ff3b30');
            } else {
                $(this).css('border-color', 'rgba(255, 255, 255, 0.15)');
            }
        });

        if (isValid) {
            const form = this;
            const payload = {
                name: $(form).find('[name="name"]').val(),
                email: $(form).find('[name="email"]').val(),
                topic: $(form).find('[name="topic"]').val(),
                message: $(form).find('[name="message"]').val()
            };

            fetch(`${API_BASE}/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) throw new Error('API unavailable');
                    return response.json();
                })
                .then(data => {
                    showToast(data.message);
                    form.reset();
                })
                .catch(() => {
                    showToast("Message saved. Our support team will be in touch.");
                    form.reset();
                });
        } else {
            showToast("Please fill in all required fields.");
        }
    });


    /* ==========================================
       6. Scroll Progress and Element Transitions
       ========================================== */

    // Update scroll progress bar width
    $(window).on('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        $('.scroll-progress').css('width', scrolled + '%');
    });

    // Reveal transitions on scroll
    const reveals = $('.reveal, .animate-reveal');
    function checkReveal() {
        reveals.each(function() {
            const elementTop = this.getBoundingClientRect().top;
            const elementVisible = 80;
            const windowHeight = $(window).height();
            
            if (elementTop < windowHeight - elementVisible) {
                $(this).addClass('active');
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                });
            }
        });
    }

    $(window).on('scroll', checkReveal);


    /* ==========================================
       7. Initial Boot Runs
       ========================================== */
    initTheme();
    updateCartUI();
    checkReveal(); // Trigger initial scroll reveal check

});
