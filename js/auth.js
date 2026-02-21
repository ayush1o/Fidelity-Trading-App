/* =====================================================
   RUN ONLY AFTER DOM LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const page = window.location.pathname.split("/").pop();
    const token = localStorage.getItem("token");

    /* ================= SESSION CONTROL ================= */

    if (
        token &&
        (page === "index.html" ||
         page === "login.html" ||
         page === "signup.html" ||
         page === "")
    ) {
        window.location.replace("dashboard.html");
        return;
    }

    if (!token && page === "dashboard.html") {
        window.location.replace("index.html");
        return;
    }

    /* ================= PROFILE BUTTON ================= */

    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    /* ================= API URL ================= */

    const API =
        location.hostname === "127.0.0.1" ||
        location.hostname === "localhost"
            ? "http://127.0.0.1:5000/api/auth"
            : "/api/auth";

    /* ================= SIGNUP ================= */

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const data = {
                    name: document.getElementById("name")?.value.trim(),
                    email: document.getElementById("email")?.value.trim(),
                    password: document.getElementById("password")?.value
                };

                const res = await fetch(`${API}/signup`, {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
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
                console.error(err);
                alert("Server connection error");
            }
        });
    }

    /* ================= LOGIN ================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        console.log("✅ Login listener attached"); // DEBUG LINE

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const email = document.getElementById("email")?.value.trim();
                const password = document.getElementById("password")?.value;

                const res = await fetch(`${API}/login`, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
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
                console.error("LOGIN ERROR:", err);
                alert("Server connection error");
            }
        });
    }

    /* ================= LOGOUT ================= */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
    function logout(){
    localStorage.clear();
    window.location.href = "index.html";
    }
    /* ================= SAFE NAV ================= */

    const walletBtn = document.getElementById("walletBtn");
    if (walletBtn) walletBtn.onclick = () => location.href="wallet.html";

    const spinWheel = document.getElementById("spinWheel");
    if (spinWheel) spinWheel.onclick = () => location.href="spin.html";

});