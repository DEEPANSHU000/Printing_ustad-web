/**
 * Printing Ustad / Printing Ustad
 * Global App Logic & Cart System
 */

const CartSystem = {
    storageKey: 'printing_ustad_cart',

    init() {
        this.updateCartBadge();
        this.observeDOM();
    },

    getCart() {
        const cart = localStorage.getItem(this.storageKey);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartBadge();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    },

    addItem(item) {
        const cart = this.getCart();
        // Check if item already exists (same ID and attributes)
        const existingIndex = cart.findIndex(i => 
            i.id === item.id && 
            JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push({
                ...item,
                uniqueId: Date.now() + Math.random().toString(36).substr(2, 9)
            });
        }

        this.saveCart(cart);
        this.showToast(`Added ${item.name} to cart!`);
    },

    removeItem(uniqueId) {
        const cart = this.getCart().filter(i => i.uniqueId !== uniqueId);
        this.saveCart(cart);
    },

    updateQuantity(uniqueId, delta) {
        const cart = this.getCart();
        const item = cart.find(i => i.uniqueId === uniqueId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + delta);
            this.saveCart(cart);
        }
    },

    updateCartBadge() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0 text-sm';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-green-400">check_circle</span>
                ${message}
            </div>
        `;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.remove('translate-y-20', 'opacity-0');
        }, 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    observeDOM() {
        // Automatically inject cart badges into elements with 'cart-trigger' class or similar if needed
        // For now we assume badges exist in the HTML
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CartSystem.init());
} else {
    CartSystem.init();
}

window.CartSystem = CartSystem;
console.log("CartSystem initialized");
