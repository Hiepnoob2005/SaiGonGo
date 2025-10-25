document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username")?.value || "";
  const email = document.getElementById("email")?.value || "";
  const password = document.getElementById("password").value;

  // Local fallback (for testing without backend)
  if (
    (username === "admin" || email === "admin@example.com") &&
    password === "1234"
  ) {
    alert("Login successful (local demo)!");
    window.location.href = "index copy.html";
    return;
  }

  try {
    // Send data to backend API
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Login successful!");
      window.location.href = "index copy.html";
    } else {
      alert(result.message || "Login failed!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to the server.");
  }
});
