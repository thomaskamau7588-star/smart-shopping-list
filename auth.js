// Get Signup Form
const signupForm = document.getElementById("signup-form");


const signupMessage = document.getElementById("signup-message");


signupForm.addEventListener("submit", function(event) {

    // Prevent Page Refresh
    event.preventDefault();

});

    // Get User Input Values
    const fullname = document.getElementById("fullname").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirm-password").value;