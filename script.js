
const form = document.getElementById("registrationForm");

const nameInput = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const dobInput = document.getElementById("dob");
const countryInput = document.getElementById("country");
const bioInput = document.getElementById("bio");
const termsInput = document.getElementById("terms");

const message = document.getElementById("formMessage");

// Prevent selecting a future date of birth.
dobInput.max = new Date().toLocaleDateString("en-CA");

// 1. Show or hide password
document.querySelectorAll(".toggle").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(this.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "Hide";
        } else {
            input.type = "password";
            this.textContent = "Show";
        }
    });
});

// 2. Display password strength
function checkPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");

    const levels = [
        { label: "Very weak", width: "20%", color: "#ef4444" },
        { label: "Weak", width: "40%", color: "#f97316" },
        { label: "Fair", width: "60%", color: "#eab308" },
        { label: "Good", width: "80%", color: "#22c55e" },
        { label: "Strong", width: "100%", color: "#15803d" }
    ];

    bar.style.width = password ? levels[score - 1]?.width || "20%" : "0";
    bar.style.background = levels[score - 1]?.color || "#ef4444";
    text.textContent = password
        ? levels[score - 1]?.label || "Very weak"
        : "Password strength";
}

passwordInput.addEventListener("input", () => {
    checkPasswordStrength(passwordInput.value);
    clearError("passwordError", passwordInput);
});

// 3. Show validation errors
function showError(input, errorId, text) {
    document.getElementById(errorId).textContent = text;
    input.classList.add("invalid");
}

function clearError(errorId, input) {
    document.getElementById(errorId).textContent = "";
    input.classList.remove("invalid");
}

// 4. Validate full name
function validateName() {
    const name = nameInput.value.trim();

    if (name.length < 3) {
        showError(nameInput, "nameError",
            "Name must contain at least 3 characters.");
        return false;
    }

    clearError("nameError", nameInput);
    return true;
}

// 5. Validate username
function validateUsername() {
    const username = usernameInput.value.trim();

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {
        showError(usernameInput, "usernameError",
            "Use 4–20 letters, numbers or underscores.");
        return false;
    }

    clearError("usernameError", usernameInput);
    return true;
}

// 6. Validate email
function validateEmail() {
    const email = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email)) {
        showError(emailInput, "emailError",
            "Please enter a valid email address.");
        return false;
    }

    clearError("emailError", emailInput);
    return true;
}

// 7. Validate Indian mobile number
function validatePhone() {
    const phone = phoneInput.value.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
        showError(phoneInput, "phoneError",
            "Enter a valid 10-digit Indian mobile number.");
        return false;
    }

    clearError("phoneError", phoneInput);
    return true;
}

// 8. Validate password
function validatePassword() {
    const password = passwordInput.value;

    const valid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

    if (!valid) {
        showError(passwordInput, "passwordError",
            "Use 8+ characters with uppercase, lowercase, number and symbol.");
        return false;
    }

    clearError("passwordError", passwordInput);
    return true;
}

// 9. Confirm password
function validateConfirmPassword() {
    if (
        confirmInput.value === "" ||
        confirmInput.value !== passwordInput.value
    ) {
        showError(confirmInput, "confirmError",
            "Passwords do not match.");
        return false;
    }

    clearError("confirmError", confirmInput);
    return true;
}

// 10. Validate date of birth
function validateDOB() {
    const dob = dobInput.value;

    if (!dob || new Date(dob + "T00:00:00") > new Date()) {
        showError(dobInput, "dobError",
            "Please select a valid date of birth.");
        return false;
    }

    clearError("dobError", dobInput);
    return true;
}

// 11. Count bio characters
bioInput.addEventListener("input", function () {
    document.getElementById("charCount").textContent =
        this.value.length;
});

// 12. Validate fields while typing
nameInput.addEventListener("input", validateName);
usernameInput.addEventListener("input", validateUsername);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
confirmInput.addEventListener("input", validateConfirmPassword);
dobInput.addEventListener("change", validateDOB);

passwordInput.addEventListener("input", () => {
    if (confirmInput.value) validateConfirmPassword();
});

// 13. Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    message.className = "";
    message.textContent = "";

    const checks = [
        validateName(),
        validateUsername(),
        validateEmail(),
        validatePhone(),
        validatePassword(),
        validateConfirmPassword(),
        validateDOB()
    ];

    if (!countryInput.value) {
        countryInput.classList.add("invalid");
        checks.push(false);
    } else {
        countryInput.classList.remove("invalid");
    }

    if (!termsInput.checked) {
        document.getElementById("termsError").textContent =
            "Please accept the Terms and Conditions.";
        checks.push(false);
    } else {
        document.getElementById("termsError").textContent = "";
    }

    // Check whether every validation passed.
    if (checks.includes(false)) {
        message.textContent =
            "Please correct the errors and complete all required fields.";
        message.className = "failure";

        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();

        return;
    }

    // Collect selected interests.
    const hobbies = [];

    document.querySelectorAll('input[name="hobby"]:checked')
        .forEach(checkbox => hobbies.push(checkbox.value));

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Demonstrate successful registration.
    message.textContent =
        `Welcome, ${nameInput.value.trim()}! ` +
        "Your form passed validation. This is a demo; " +
        "no account has been created.";

    message.className = "success";

    console.log("Demo registration details:", {
        name: nameInput.value.trim(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dateOfBirth: dobInput.value,
        country: countryInput.value,
        gender: gender ? gender.value : "Not specified",
        hobbies: hobbies,
        bio: bioInput.value.trim()
    });
});

// 14. Reset all errors and messages
form.addEventListener("reset", function () {
    setTimeout(() => {
        document.querySelectorAll(".error").forEach(element => {
            element.textContent = "";
        });

        document.querySelectorAll(".invalid").forEach(element => {
            element.classList.remove("invalid");
        });

        message.textContent = "";
        message.className = "";

        document.getElementById("charCount").textContent = "0";
        document.getElementById("strengthBar").style.width = "0";
        document.getElementById("strengthText").textContent =
            "Password strength";

        document.querySelectorAll(".toggle").forEach(button => {
            button.textContent = "Show";
        });

        passwordInput.type = "password";
        confirmInput.type = "password";
    }, 0);
});

// 15. Demo login link
document.getElementById("loginLink").addEventListener("click", function (event) {
    event.preventDefault();
    alert("Login page has not been created yet.");
});