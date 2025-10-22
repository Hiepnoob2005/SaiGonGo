import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { email: "test@example.com", password: "123456" }, // Dummy data
];

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
