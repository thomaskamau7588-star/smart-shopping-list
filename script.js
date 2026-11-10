// Get HTML Elements
const shoppingForm = document.getElementById("shopping-form");
const shoppingItems = document.getElementById("shopping-items");
const emptyMessage = document.getElementById("empty-message");
const clearButton = document.getElementById("clear-button");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");

// Summary Elements
const totalItems = document.getElementById("total-items");
const purchasedItems = document.getElementById("purchased-items");
const remainingItems = document.getElementById("remaining-items");
const estimatedCost = document.getElementById("estimated-cost");

// Get Logged In User
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

// User-specific Storage
const storageKey = `shoppingList_${currentUser?.email || "guest"}`;
let shoppingList = JSON.parse(localStorage.getItem(storageKey)) || [];

// Save Shopping List
function saveShoppingList() {
    localStorage.setItem(storageKey, JSON.stringify(shoppingList));
}

// Display Shopping Items
function displayShoppingItems() {
    shoppingItems.innerHTML = "";

    const search = searchInput.value.toLowerCase().trim();

    // Search and Filter Items
    const filteredItems = shoppingList.filter(item =>
        item.name.toLowerCase().includes(search) &&
        (categoryFilter.value === "All" || item.category === categoryFilter.value) &&
        (statusFilter.value === "All" ||
            (statusFilter.value === "Purchased" && item.purchased) ||
            (statusFilter.value === "Pending" && !item.purchased))
    );

    emptyMessage.style.display = filteredItems.length ? "none" : "block";
    emptyMessage.textContent = shoppingList.length
        ? "No matching shopping items found."
        : "Your shopping list is empty. Add your first item!";

    shoppingItems.appendChild(emptyMessage);

        // Create Shopping Item Cards
    filteredItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "shopping-item";

        const details = document.createElement("div");
        details.className = "item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const info = document.createElement("p");
        info.textContent = `Quantity: ${item.quantity} | Category: ${item.category}`;

        const price = document.createElement("p");
        price.textContent = `Total: KSh ${(item.price * item.quantity).toFixed(2)}`;

        const status = document.createElement("p");
        status.textContent = item.purchased ? "Purchased" : "Pending";
        status.className = item.purchased ? "purchased-status" : "pending-status";

        details.append(name, info, price, status);

        const actions = document.createElement("div");
        actions.className = "item-actions";

  // Create Action Buttons
        const createButton = (text, action) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = text;
            button.addEventListener("click", action);
            return button;
        };

        actions.append(
            createButton(item.purchased ? "Undo Purchase" : "Mark Purchased",
                () => togglePurchased(item.id)),
            createButton("Edit", () => editItem(item.id)),
            createButton("Delete", () => deleteItem(item.id))
        );

        card.append(details, actions);
        shoppingItems.appendChild(card);
    });

    updateSummary();
}

// Add Shopping Item
shoppingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("item-name").value.trim();
    const quantity = Number(document.getElementById("item-quantity").value);
    const category = document.getElementById("item-category").value;
    const price = Number(document.getElementById("item-price").value);

    if (!name || !category || !Number.isInteger(quantity) ||
        quantity < 1 || !Number.isFinite(price) || price < 0) {
        alert("Please enter valid item details.");
        return;
    }

     // Create New Item
    const newItem = {
        id: Date.now().toString(),
        name,
        quantity,
        category,
        price,
        purchased: false
    };

    shoppingList.push(newItem);

    saveShoppingList();
    shoppingForm.reset();
    displayShoppingItems();
});

// Mark Item as Purchased
function togglePurchased(id) {
    shoppingList = shoppingList.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
    );

    saveShoppingList();
    displayShoppingItems();
}

// Edit Shopping Item
function editItem(id) {
    const item = shoppingList.find(item => item.id === id);
    if (!item) return;

    const name = prompt("Enter item name:", item.name);
    if (name === null) return;

    const quantity = prompt("Enter quantity:", item.quantity);
    if (quantity === null) return;

    const price = prompt("Enter price per item:", item.price);
    if (price === null) return;

    const newQuantity = Number(quantity);
    const newPrice = Number(price);

    if (!name.trim() || !Number.isInteger(newQuantity) ||
        newQuantity < 1 || !Number.isFinite(newPrice) || newPrice < 0) {
        alert("Please enter valid details.");
        return;
    }

    shoppingList = shoppingList.map(current =>
        current.id === id
            ? { ...current, name: name.trim(), quantity: newQuantity, price: newPrice }
            : current
    );

    saveShoppingList();
    displayShoppingItems();
}

// Delete Shopping Item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    shoppingList = shoppingList.filter(item => item.id !== id);

    saveShoppingList();
    displayShoppingItems();
}

// Update Shopping Summary
function updateSummary() {
    const total = shoppingList.reduce((sum, item) => sum + item.quantity, 0);

    const purchased = shoppingList.reduce(
        (sum, item) => sum + (item.purchased ? item.quantity : 0), 0
    );

    const cost = shoppingList.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    totalItems.textContent = total;
    purchasedItems.textContent = purchased;
    remainingItems.textContent = total - purchased;
    estimatedCost.textContent = `KSh ${cost.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Search and Filter
searchInput.addEventListener("input", displayShoppingItems);
categoryFilter.addEventListener("change", displayShoppingItems);
statusFilter.addEventListener("change", displayShoppingItems);

// Clear Shopping List
clearButton.addEventListener("click", function() {
    if (!shoppingList.length) {
        alert("Your shopping list is already empty.");
        return;
    }

    if (confirm("Are you sure you want to clear your shopping list?")) {
        shoppingList = [];
        saveShoppingList();
        displayShoppingItems();
    }
});

// Initial Display
displayShoppingItems();