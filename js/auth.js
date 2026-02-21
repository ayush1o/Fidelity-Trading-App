/* ================= AUTO SESSION ================= */

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname;

    // Redirect logged user away from login/signup
    if (
        token &&
        (currentPage.includes("login.html") ||
         currentPage.includes("signup.html"))
    ) {
        window.location.replace("dashboard.html");
    }
});


/* ================= PROFILE CLICK ================= */

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {
    profileBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}


/* ================= API BASE URL ================= */
/* AUTO SWITCH LOCAL + LIVE */

const API =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost"
        ? "http://127.0.0.1:5000/api/auth"
        : "/api/auth";   // ✅ VERY IMPORTANT (same server on Render)


/* ================= SIGNUP ================= */

const signup = document.getElementById("signupForm");

if (signup) {

    signup.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {

            const data = {
                name: document.getElementById("name")?.value.trim(),
                email: document.getElementById("email")?.value.trim(),
                password: document.getElementById("password")?.value
            };

            const res = await fetch(`${API}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem("token", result.token);
                window.location.replace("dashboard.html");
            } else {
                alert(result.message || "Signup failed");
            }

        } catch (err) {
            console.error("Signup Error:", err);
            alert("Server connection error");
        }
    });
}


/* ================= LOGIN ================= */

const login = document.getElementById("loginForm");

if (login) {

    login.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {

            const email = document.getElementById("email")?.value.trim();
            const password = document.getElementById("password")?.value;

            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", result.name || "");
                window.location.replace("dashboard.html");
            } else {
                alert(result.message || "Login failed");
            }

        } catch (err) {
            console.error("Login Error:", err);
            alert("Server connection error");
        }
    });
}


/* ================= LOGOUT ================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.replace("login.html");
    });
}


/* ================= SAFE NAV BUTTONS ================= */

const walletBtn = document.getElementById("walletBtn");
if (walletBtn) {
    walletBtn.onclick = () => window.location.href = "wallet.html";
}

const spinWheel = document.getElementById("spinWheel");
if (spinWheel) {
    spinWheel.onclick = () => window.location.href = "spin.html";
}


/* ================= REVIEW OVERLAY ================= */

const reviewsBtn = document.getElementById("reviewsBtn");
const overlay = document.getElementById("reviewOverlay");
const closeBtn = document.getElementById("closeReview");

if (reviewsBtn && overlay) {
    reviewsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.add("active");
    });
}

if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
    });
}