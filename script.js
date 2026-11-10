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
