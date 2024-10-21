const express = require("express");
const cors = require("cors");
const fs = require("fs");
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const newUser = req.body;

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const parsedData = JSON.parse(data);
      parsedData.push(newUser);

      fs.writeFile(
        "./data.json",
        JSON.stringify(parsedData, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Error writing file" });
          }
          res.status(200).json({ message: "Registration successful!" });
        }
      );
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const parsedData = JSON.parse(data);
      const user = parsedData.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, "your_secret_key", {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
