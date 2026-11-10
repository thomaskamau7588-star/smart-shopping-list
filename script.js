
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

    // Create Shopping Table
    if (filteredItems.length > 0) {

        const table = document.createElement("table");
        table.className = "shopping-table";

        // Create Table Header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headings = [
            "Item",
            "Quantity",
            "Category",
            "Unit Price",
            "Total Price",
            "Status",
            "Actions"
        ];

        headings.forEach(heading => {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create Table Body
        const tbody = document.createElement("tbody");

        filteredItems.forEach(item => {

            const row = document.createElement("tr");

            // Item Name
            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;

            // Quantity
            const quantityCell = document.createElement("td");
            quantityCell.textContent = item.quantity;

            // Category
            const categoryCell = document.createElement("td");
            categoryCell.textContent = item.category;

            // Unit Price
            const priceCell = document.createElement("td");
            priceCell.textContent = `KSh ${item.price.toFixed(2)}`;

            // Total Price
            const totalCell = document.createElement("td");
            totalCell.textContent =
                `KSh ${(item.price * item.quantity).toFixed(2)}`;

            // Status
            const statusCell = document.createElement("td");
            statusCell.textContent = item.purchased ? "Purchased" : "Pending";
            statusCell.className = item.purchased
                ? "purchased-status"
                : "pending-status";

            // Actions
            const actionsCell = document.createElement("td");

            // Create Action Buttons
            const createButton = (text, action) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = text;
                button.addEventListener("click", action);
                return button;
            };

            actionsCell.append(
                createButton(
                    item.purchased ? "Undo" : "Mark Purchased",
                    () => togglePurchased(item.id)
                ),
                createButton("Edit", () => editItem(item.id)),
                createButton("Delete", () => deleteItem(item.id))
            );

            // Add Cells to Row
            row.append(
                nameCell,
                quantityCell,
                categoryCell,
                priceCell,
                totalCell,
                statusCell,
                actionsCell
            );

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        shoppingItems.appendChild(table);
    }

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
            ? {
                ...current,
                name: name.trim(),
                quantity: newQuantity,
                price: newPrice
            }
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
    const total = shoppingList.reduce(
        (sum, item) => sum + item.quantity, 0
    );

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
