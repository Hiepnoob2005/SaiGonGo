document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    // Simple client-side check
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Example backend request
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Password reset link sent to your email!");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  });
