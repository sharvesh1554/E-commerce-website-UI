// ================================
// FORMA E-COMMERCE STORE
// script.js
// ================================


// ---------- PRODUCT DATA ----------

const products = [
  {
    id: 1,
    name: "Studio Headphones",
    category: "Tech",
    price: 89,
    emoji: "🎧",
    bg: "#dce8ce",
    badge: "BEST SELLER",
    description:
      "Comfortable, balanced headphones designed for everyday listening. Clean sound, timeless design, and all-day comfort."
  },
  {
    id: 2,
    name: "Minimal Watch",
    category: "Lifestyle",
    price: 129,
    emoji: "⌚",
    bg: "#e8e1d6",
    badge: "NEW",
    description:
      "A simple and elegant watch designed to complement every outfit. Minimal details, maximum versatility."
  },
  {
    id: 3,
    name: "Ceramic Mug",
    category: "Home",
    price: 24,
    emoji: "☕",
    bg: "#e7e8df",
    badge: "",
    description:
      "A beautifully simple ceramic mug made for your daily coffee, tea, and quiet moments."
  },
  {
    id: 4,
    name: "Everyday Backpack",
    category: "Lifestyle",
    price: 74,
    emoji: "🎒",
    bg: "#d9e3df",
    badge: "POPULAR",
    description:
      "A practical backpack with a clean silhouette, useful storage, and enough space for your everyday essentials."
  },
  {
    id: 5,
    name: "Wireless Speaker",
    category: "Tech",
    price: 69,
    emoji: "🔊",
    bg: "#e5ddd3",
    badge: "",
    description:
      "Compact, portable sound with a simple design that looks good anywhere in your home."
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 58,
    emoji: "💡",
    bg: "#ece7d7",
    badge: "",
    description:
      "A modern desk lamp with a warm, comfortable light for reading, working, and relaxing."
  },
  {
    id: 7,
    name: "Portable Camera",
    category: "Tech",
    price: 149,
    emoji: "📷",
    bg: "#dbe2e5",
    badge: "NEW",
    description:
      "Capture everyday moments with a compact camera designed for simple and spontaneous photography."
  },
  {
    id: 8,
    name: "Soft Throw",
    category: "Home",
    price: 45,
    emoji: "🧶",
    bg: "#e7ddd6",
    badge: "",
    description:
      "A soft and comfortable throw designed to make your favorite space feel warmer and more inviting."
  }
];


// ---------- ELEMENTS ----------

const productGrid = document.getElementById("product-grid");
const resultsCount = document.getElementById("results-count");
const emptyResults = document.getElementById("empty-results");

const categories = document.getElementById("categories");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");

const cartItems = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const shippingElement = document.getElementById("shipping");
const totalElement = document.getElementById("total");
const shippingNote = document.getElementById("shipping-note");

const checkoutButton = document.getElementById("checkout-button");
const checkoutTotal = document.getElementById("checkout-total");

const productDialog = document.getElementById("product-dialog");
const productDetails = document.getElementById("product-details");

const cartDialog = document.getElementById("cart-dialog");
const checkoutDialog = document.getElementById("checkout-dialog");
const successDialog = document.getElementById("success-dialog");

const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

const resetFiltersButton = document.getElementById("reset-filters");

const toast = document.getElementById("toast");
const yearElement = document.getElementById("year");


// ---------- STORE STATE ----------

let activeCategory = "All";
let searchTerm = "";
let sortType = "featured";

let cart = JSON.parse(localStorage.getItem("forma-cart")) || [];


// ---------- HELPERS ----------

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}


function saveCart() {
  localStorage.setItem("forma-cart", JSON.stringify(cart));
}


function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}


function getSubtotal() {
  return cart.reduce((total, cartItem) => {
    const product = products.find(
      product => product.id === cartItem.id
    );

    return total + product.price * cartItem.quantity;
  }, 0);
}


function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}


// ---------- RENDER PRODUCTS ----------

function getFilteredProducts() {

  let filteredProducts = [...products];

  // Category filter
  if (activeCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      product => product.category === activeCategory
    );
  }

  // Search filter
  if (searchTerm.trim() !== "") {
    filteredProducts = filteredProducts.filter(product => {

      const searchText = `
        ${product.name}
        ${product.category}
        ${product.description}
      `.toLowerCase();

      return searchText.includes(
        searchTerm.toLowerCase()
      );
    });
  }

  // Sorting
  switch (sortType) {

    case "price-low":
      filteredProducts.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price-high":
      filteredProducts.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name":
      filteredProducts.sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      break;

    default:
      break;
  }

  return filteredProducts;
}


function renderProducts() {

  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = "";

  resultsCount.textContent =
    `${filteredProducts.length} ${
      filteredProducts.length === 1
        ? "product"
        : "products"
    }`;


  if (filteredProducts.length === 0) {

    productGrid.hidden = true;
    emptyResults.hidden = false;

    return;
  }


  productGrid.hidden = false;
  emptyResults.hidden = true;


  filteredProducts.forEach(product => {

    const productCard = document.createElement("article");

    productCard.className = "product-card";

    productCard.innerHTML = `
      <button
        class="product-image"
        style="--product-bg: ${product.bg}"
        data-product-id="${product.id}"
        aria-label="View details for ${product.name}"
      >
        ${
          product.badge
            ? `<span class="product-badge">${product.badge}</span>`
            : ""
        }

        <span class="product-emoji">
          ${product.emoji}
        </span>
      </button>

      <p class="product-meta">
        ${product.category}
      </p>

      <h3>
        ${product.name}
      </h3>

      <div class="product-bottom">

        <span class="price">
          ${formatPrice(product.price)}
        </span>

        <button
          class="add-button"
          data-add-id="${product.id}"
          type="button"
        >
          Add to bag
        </button>

      </div>
    `;

    productGrid.appendChild(productCard);
  });
}


// ---------- CATEGORY FILTER ----------

categories.addEventListener("click", event => {

  const button = event.target.closest(".chip");

  if (!button) return;

  activeCategory = button.dataset.category;


  document
    .querySelectorAll(".chip")
    .forEach(chip => {

      chip.classList.remove("active");

      chip.setAttribute(
        "aria-pressed",
        "false"
      );
    });


  button.classList.add("active");

  button.setAttribute(
    "aria-pressed",
    "true"
  );


  renderProducts();
});


// ---------- SEARCH ----------

searchInput.addEventListener("input", event => {

  searchTerm = event.target.value;

  renderProducts();
});


// ---------- SORT ----------

sortSelect.addEventListener("change", event => {

  sortType = event.target.value;

  renderProducts();
});


// ---------- RESET FILTERS ----------

resetFiltersButton.addEventListener("click", () => {

  activeCategory = "All";

  searchTerm = "";

  sortType = "featured";


  searchInput.value = "";

  sortSelect.value = "featured";


  document
    .querySelectorAll(".chip")
    .forEach(chip => {

      const isAll = chip.dataset.category === "All";

      chip.classList.toggle(
        "active",
        isAll
      );

      chip.setAttribute(
        "aria-pressed",
        isAll
      );
    });


  renderProducts();
});


// ---------- PRODUCT DETAILS ----------

function openProductDetails(productId) {

  const product = products.find(
    product => product.id === Number(productId)
  );

  if (!product) return;


  productDetails.innerHTML = `

    <div
      class="detail-art"
      style="--product-bg: ${product.bg}"
    >
      ${product.emoji}
    </div>

    <p class="product-meta">
      ${product.category}
    </p>

    <h3>
      ${product.name}
    </h3>

    <p class="detail-description">
      ${product.description}
    </p>

    <strong class="detail-price">
      ${formatPrice(product.price)}
    </strong>

    <button
      class="button primary full-width"
      id="detail-add-button"
      data-product-id="${product.id}"
    >
      Add to bag
    </button>
  `;


  productDialog.showModal();
}


// ---------- PRODUCT GRID EVENTS ----------

productGrid.addEventListener("click", event => {

  // Product image / details

  const productImage = event.target.closest(
    "[data-product-id]"
  );

  if (productImage) {

    openProductDetails(
      productImage.dataset.productId
    );

    return;
  }


  // Add to cart

  const addButton = event.target.closest(
    "[data-add-id]"
  );

  if (addButton) {

    addToCart(
      Number(addButton.dataset.addId)
    );
  }
});


// ---------- ADD TO CART ----------

function addToCart(productId) {

  const existingItem = cart.find(
    item => item.id === productId
  );


  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      id: productId,
      quantity: 1
    });
  }


  saveCart();

  updateCart();

  showToast("Added to your bag ✓");
}


// ---------- PRODUCT DETAIL ADD BUTTON ----------

productDetails.addEventListener("click", event => {

  const button = event.target.closest(
    "#detail-add-button"
  );

  if (!button) return;


  addToCart(
    Number(button.dataset.productId)
  );


  productDialog.close();
});


// ---------- UPDATE CART ----------

function updateCart() {

  const itemCount = getCartItemCount();

  cartCount.textContent = itemCount;

  cartHeadingCount.textContent =
    itemCount > 0
      ? `(${itemCount})`
      : "";


  renderCart();


  const subtotal = getSubtotal();

  let shipping = 0;


  if (subtotal > 0 && subtotal < 100) {
    shipping = 10;
  }


  const total = subtotal + shipping;


  subtotalElement.textContent =
    formatPrice(subtotal);


  shippingElement.textContent =
    shipping === 0
      ? subtotal === 0
        ? "$0.00"
        : "FREE"
      : formatPrice(shipping);


  totalElement.textContent =
    formatPrice(total);


  checkoutTotal.textContent =
    formatPrice(total);


  // Shipping message

  if (subtotal === 0) {

    shippingNote.textContent =
      "Add items to your bag to continue.";

  } else if (subtotal >= 100) {

    shippingNote.textContent =
      "You qualify for free shipping! ✓";

  } else {

    const amountLeft = 100 - subtotal;

    shippingNote.textContent =
      `Add ${formatPrice(amountLeft)} more for free shipping.`;
  }


  // Disable checkout if empty

  checkoutButton.disabled =
    cart.length === 0;
}


// ---------- RENDER CART ----------

function renderCart() {

  cartItems.innerHTML = "";


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-state">

        <h3>Your bag is empty</h3>

        <p>
          Explore the collection and find
          something you'll love.
        </p>

      </div>
    `;

    return;
  }


  cart.forEach(cartItem => {

    const product = products.find(
      product => product.id === cartItem.id
    );


    if (!product) return;


    const cartItemElement =
      document.createElement("article");


    cartItemElement.className =
      "cart-item";


    cartItemElement.innerHTML = `

      <div
        class="cart-thumb"
        style="--product-bg: ${product.bg}"
      >
        ${product.emoji}
      </div>


      <div>

        <h3>
          ${product.name}
        </h3>

        <p>
          ${formatPrice(product.price)}
        </p>


        <div class="quantity-control">

          <button
            type="button"
            data-action="decrease"
            data-id="${product.id}"
            aria-label="Decrease quantity"
          >
            −
          </button>


          <span>
            ${cartItem.quantity}
          </span>


          <button
            type="button"
            data-action="increase"
            data-id="${product.id}"
            aria-label="Increase quantity"
          >
            +
          </button>

        </div>

      </div>


      <div>

        <strong>
          ${formatPrice(
            product.price * cartItem.quantity
          )}
        </strong>

        <br>

        <button
          class="remove-button"
          type="button"
          data-action="remove"
          data-id="${product.id}"
        >
          Remove
        </button>

      </div>
    `;


    cartItems.appendChild(
      cartItemElement
    );
  });
}


// ---------- CART CONTROLS ----------

cartItems.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-action]"
  );

  if (!button) return;


  const productId =
    Number(button.dataset.id);


  const action =
    button.dataset.action;


  const cartItem =
    cart.find(
      item => item.id === productId
    );


  if (!cartItem) return;


  if (action === "increase") {

    cartItem.quantity += 1;
  }


  if (action === "decrease") {

    cartItem.quantity -= 1;


    if (cartItem.quantity <= 0) {

      cart = cart.filter(
        item => item.id !== productId
      );
    }
  }


  if (action === "remove") {

    cart = cart.filter(
      item => item.id !== productId
    );

    showToast("Item removed from bag");
  }


  saveCart();

  updateCart();
});


// ---------- OPEN CART ----------

cartButton.addEventListener("click", () => {

  updateCart();

  cartDialog.showModal();
});


// ---------- CLOSE DIALOGS ----------

document.addEventListener("click", event => {

  const closeButton =
    event.target.closest("[data-close]");


  if (!closeButton) return;


  const dialogId =
    closeButton.dataset.close;


  const dialog =
    document.getElementById(dialogId);


  if (dialog) {

    dialog.close();
  }
});


// ---------- CLICK BACKDROP TO CLOSE ----------

[
  productDialog,
  checkoutDialog,
  successDialog
].forEach(dialog => {

  dialog.addEventListener("click", event => {

    if (event.target === dialog) {

      dialog.close();
    }
  });
});


// ---------- CHECKOUT ----------

checkoutButton.addEventListener("click", () => {

  if (cart.length === 0) {

    showToast("Your bag is empty.");

    return;
  }


  cartDialog.close();

  checkoutDialog.showModal();
});


// ---------- PLACE ORDER ----------

checkoutForm.addEventListener("submit", event => {

  event.preventDefault();


  if (!checkoutForm.checkValidity()) {

    checkoutForm.reportValidity();

    return;
  }


  const formData =
    new FormData(checkoutForm);


  const firstName =
    formData.get("firstName");


  checkoutDialog.close();


  orderMessage.textContent =
    `Thanks, ${firstName}! Your demo order has been confirmed.`;


  // Clear cart

  cart = [];

  saveCart();

  updateCart();

  checkoutForm.reset();


  successDialog.showModal();
});


// ---------- FOOTER YEAR ----------

yearElement.textContent =
  new Date().getFullYear();


// ---------- INITIAL LOAD ----------

renderProducts();

updateCart();