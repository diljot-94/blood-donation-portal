document.addEventListener("DOMContentLoaded", function () {
    const registerBox = document.getElementById("registerBox");
    const loginBox = document.getElementById("loginBox");
    const showLoginBtn = document.getElementById("showLogin");
    const showRegisterBtn = document.getElementById("showRegister");
    const donorForm = document.getElementById("donorForm");

    // ✅ Toggle to Show Login Form
    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            registerBox.style.display = "none";
            loginBox.style.display = "block";
        });
    }
    // ✅ Toggle to Show Register Form
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", function (event) {
            event.preventDefault();
            loginBox.style.display = "none";
            registerBox.style.display = "block";
        });
    }

    // ✅ Registration Form (Redirects to index2.html after successful registration)
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const userData = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                phno: document.getElementById("phno").value.trim(),
                password: document.getElementById("password").value.trim()
            };

            try {
                const response = await fetch("http://localhost:3019/sign_up", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });
                if (!response.ok) {
                    throw new Error("Registration failed! Server error.");
                }
                alert("✅ Registration successful! Redirecting...");
                // ✅ Redirect to index2.html after successful registration
                setTimeout(() => {
                    window.location.href = "index2.html";
                }, 2000);

            } catch (error) {
                alert(`❌ ${error.message}`);
                console.error("🚨 Registration Error:", error);
            }
        });
    }
    // ✅ Login Form (Redirects to index2.html after successful login)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const loginData = {
                phno: document.getElementById("loginPhno").value.trim(),
                password: document.getElementById("loginPassword").value.trim()
            };

            try {
                const response = await fetch("http://localhost:3019/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                if (!response.ok) {
                    throw new Error("Invalid login credentials or server error!");
                }

                alert("✅ Login successful! Redirecting...");

                // ✅ Redirect to index3.html after successful login
                setTimeout(() => {
                    window.location.href = "index3.html";
                }, 2000);

            } catch (error) {
                alert(`❌ ${error.message}`);
                console.error("🚨 Login Error:", error);
            }
        });
    }

    // ✅ Donor Form Submission (Redirects to index3.html after successful donor registration)
    if (donorForm) {
        donorForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append("bloodGroup", document.getElementById("bloodGroup").value);
            formData.append("age", document.getElementById("age").value);
            formData.append("diet", document.getElementById("diet").value);
            formData.append("address", document.getElementById("address").value);
            
            const bloodReport = document.getElementById("bloodReport")?.files[0];
            if (bloodReport) {
                formData.append("bloodReport", bloodReport);
            }

            try {
                const response = await fetch("http://localhost:3019/register_donor", {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Error submitting donor form!");
                }

                alert("✅ Donor registration successful! Redirecting...");

                // ✅ Redirect to index3.html after donor registration
                setTimeout(() => {
                    window.location.href = "index3.html";
                }, 2000);

            } catch (error) {
                alert("❌ Error submitting form!");
                console.error("🚨 Donor Registration Error:", error);
            }
        });
    }
});
