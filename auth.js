// Get Signup Form
const signupForm = document.getElementById("signup-form");


const signupMessage = document.getElementById("signup-message");


signupForm.addEventListener("submit", function(event) {

    // Prevent Page Refresh
    event.preventDefault();


    // Get User Input Values
    const fullname = document.getElementById("fullname").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirm-password").value;

      // Check if Passwords Match
        if (password !== confirmPassword) {

            signupMessage.textContent = "Passwords do not match!";
            signupMessage.style.color = "red";

            return;
        }

           // Check Password Length
        if (password.length < 6) {

            signupMessage.textContent = "Password must be at least 6 characters!";
            signupMessage.style.color = "red";

            return;
        }

         // Get Existing Users from Local Storage
        let users = JSON.parse(localStorage.getItem("users")) || [];


        // Check if Email Already Exists
        const existingUser = users.find(function(user) {
            return user.email === email;

        });

         if (existingUser) {

            signupMessage.textContent = "This email is already registered!";
            signupMessage.style.color = "red";

            return;
        }

           // Create New User
        const newUser = {
            fullname: fullname,
            email: email,
            password: password
        };


        // Add New User to Users Array
        users.push(newUser);


        // Save Users to Local Storage
        localStorage.setItem("users", JSON.stringify(users));


        // Display Success Message
        signupMessage.textContent = "Account created successfully!";
        signupMessage.style.color = "green";


        // Clear Signup Form
        signupForm.reset();

    });


